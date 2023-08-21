import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, over } from 'lodash'

import Column from './ListColumns/Column/Column'
import Cart from './ListColumns/Column/ListCards/Cart/Cart'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_CARD'
}

function BoardContent({ board }) {
  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp bị gọi event

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // tim column theo card id
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }
  // function chung xu ly viec: cap nhap state trong truong hop di chuyen card giua ca column khac nhau
  const moveCardBetweenColums = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColums) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      )
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColums)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }
      if (nextOverColumn) {
        // kiem tra xem card dag keo no co dag ton tai o overcolumn chua
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // tiep theo la them cai card  dag keo vao overcolumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )
        // cap nhat lai mang cardOderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }
      return nextColumns
    })
  }

  //handle drag Start
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    // ko lm j them neu keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event
    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenColums(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //handle drag End
  const handleDragEnd = (event) => {
    const { active, over } = event
    // kiểm tra nếu không tồn tại over
    if (!active || !over) return
    // xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenColums(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // lấy vị trí củ
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        // Lấy vị trí mới
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        setOrderedColumns((prevColums) => {
          const nextColumns = cloneDeep(prevColums)

          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)

          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((c) => c._id)

          return nextColumns
        })
      }
    }

    // xu ly keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      console.log('hanh dong keo column tha ko lam j ca')
      // neu vi tri khac voi vi tri ban dau
      if (active.id !== over.id) {
        // lấy vị trí củ
        const oldColumIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        // Lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumIndex,
          newColumnIndex
        )
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

        setOrderedColumns(dndOrderedColumns)
      }
    }

    // nhung du lieu sau khi keo tha nay lun phai dua ve gia tri null ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  // drop animation
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  //custom thuat toan nang cao va cham
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      const intersections = !!pointerIntersections?.length
        ? pointerIntersections
        : rectIntersection

      let overId = getFirstCollision(intersections, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column.id === overId
        )
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              }
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )
  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      //custom thuat toan nang cao va cham
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode == 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Cart card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
