import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Board, List, Card, Label, BoardState } from '@/types/kanban';

export const useKanbanStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,

      // Board actions
      createBoard: (title: string, userId: string) => {
        const newBoard: Board = {
          id: uuidv4(),
          title,
          lists: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoard: newBoard,
        }));

        toast.success(`Created board "${title}"`);

        // Create default lists with sample cards
        const { createList, createCard } = get();
        const todoListId = uuidv4();
        const inProgressListId = uuidv4();
        const doneListId = uuidv4();

        // Create lists
        set((state) => {
          const todoList: List = {
            id: todoListId,
            title: 'To Do',
            cards: [],
            position: 0,
            boardId: newBoard.id,
          };
          
          const inProgressList: List = {
            id: inProgressListId,
            title: 'In Progress',
            cards: [],
            position: 1,
            boardId: newBoard.id,
          };
          
          const doneList: List = {
            id: doneListId,
            title: 'Done',
            cards: [],
            position: 2,
            boardId: newBoard.id,
          };

          const updatedBoard = {
            ...newBoard,
            lists: [todoList, inProgressList, doneList],
          };

          return {
            ...state,
            boards: state.boards.map(board => 
              board.id === newBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });

        // Add sample cards
        setTimeout(() => {
          createCard(todoListId, 'Welcome to Project Tasks! 🎉', 'This is your first task card. Click to edit or drag to move between lists.');
          createCard(todoListId, 'Plan your project roadmap', 'Break down your project into smaller, manageable tasks.');
          createCard(inProgressListId, 'Set up your workspace', 'Configure your development environment and tools.');
          createCard(doneListId, 'Create your Kanban board', 'You\'ve successfully created your first board! Well done! 🚀');
        }, 100);
      },

      updateBoard: (boardId: string, updates: Partial<Board>) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, ...updates, updatedAt: new Date() }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, ...updates, updatedAt: new Date() }
              : state.currentBoard,
        }));
      },

      deleteBoard: (boardId: string) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          currentBoard:
            state.currentBoard?.id === boardId ? null : state.currentBoard,
        }));
      },

      setCurrentBoard: (boardId: string) => {
        const board = get().boards.find((b) => b.id === boardId);
        set({ currentBoard: board || null });
      },

      loadUserBoards: (userId: string) => {
        const state = get();
        const userBoards = state.boards.filter(board => board.userId === userId);
        set({ 
          boards: userBoards,
          currentBoard: userBoards.length > 0 ? userBoards[0] : null
        });
      },

      // List actions
      createList: (boardId: string, title: string) => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return;

        const newList: List = {
          id: uuidv4(),
          title,
          cards: [],
          position: board.lists.length,
          boardId,
        };

        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, lists: [...b.lists, newList], updatedAt: new Date() }
              : b
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  lists: [...state.currentBoard.lists, newList],
                  updatedAt: new Date(),
                }
              : state.currentBoard,
        }));

        toast.success(`Created list "${title}"`);
      },

      updateList: (listId: string, updates: Partial<List>) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) =>
              list.id === listId ? { ...list, ...updates } : list
            ),
            updatedAt: new Date(),
          })),
          currentBoard: state.currentBoard
            ? {
                ...state.currentBoard,
                lists: state.currentBoard.lists.map((list) =>
                  list.id === listId ? { ...list, ...updates } : list
                ),
                updatedAt: new Date(),
              }
            : null,
        }));
      },

      deleteList: (listId: string) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.filter((list) => list.id !== listId),
            updatedAt: new Date(),
          })),
          currentBoard: state.currentBoard
            ? {
                ...state.currentBoard,
                lists: state.currentBoard.lists.filter(
                  (list) => list.id !== listId
                ),
                updatedAt: new Date(),
              }
            : null,
        }));
      },

      moveList: (listId: string, newPosition: number) => {
        // Implementation for reordering lists
        set((state) => {
          if (!state.currentBoard) return state;

          const lists = [...state.currentBoard.lists];
          const listIndex = lists.findIndex((list) => list.id === listId);
          if (listIndex === -1) return state;

          const [movedList] = lists.splice(listIndex, 1);
          lists.splice(newPosition, 0, movedList);

          // Update positions
          const updatedLists = lists.map((list, index) => ({
            ...list,
            position: index,
          }));

          const updatedBoard = {
            ...state.currentBoard,
            lists: updatedLists,
            updatedAt: new Date(),
          };

          return {
            ...state,
            boards: state.boards.map((board) =>
              board.id === updatedBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });
      },

      // Card actions
      createCard: (listId: string, title: string, description?: string) => {
        set((state) => {
          if (!state.currentBoard) return state;

          const list = state.currentBoard.lists.find((l) => l.id === listId);
          if (!list) return state;

          const newCard: Card = {
            id: uuidv4(),
            title,
            description,
            position: list.cards.length,
            listId,
            labels: [],
          };

          const updatedBoard = {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) =>
              l.id === listId
                ? { ...l, cards: [...l.cards, newCard] }
                : l
            ),
            updatedAt: new Date(),
          };

          toast.success(`Created card "${title}"`);

          return {
            ...state,
            boards: state.boards.map((board) =>
              board.id === updatedBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });
      },

      updateCard: (cardId: string, updates: Partial<Card>) => {
        set((state) => {
          if (!state.currentBoard) return state;

          const updatedBoard = {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((list) => ({
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            })),
            updatedAt: new Date(),
          };

          return {
            ...state,
            boards: state.boards.map((board) =>
              board.id === updatedBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });
      },

      deleteCard: (cardId: string) => {
        set((state) => {
          if (!state.currentBoard) return state;

          const updatedBoard = {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((list) => ({
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            })),
            updatedAt: new Date(),
          };

          return {
            ...state,
            boards: state.boards.map((board) =>
              board.id === updatedBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });
      },

      moveCard: (cardId: string, newListId: string, newPosition: number) => {
        set((state) => {
          if (!state.currentBoard) return state;

          let cardToMove: Card | null = null;
          let sourceListId: string | null = null;

          // Find the card and source list
          for (const list of state.currentBoard.lists) {
            const card = list.cards.find((c) => c.id === cardId);
            if (card) {
              cardToMove = card;
              sourceListId = list.id;
              break;
            }
          }

          if (!cardToMove || !sourceListId) return state;

          // Remove card from source list
          const updatedLists = state.currentBoard.lists.map((list) => {
            if (list.id === sourceListId) {
              return {
                ...list,
                cards: list.cards.filter((card) => card.id !== cardId),
              };
            }
            return list;
          });

          // Add card to destination list
          const finalLists = updatedLists.map((list) => {
            if (list.id === newListId) {
              const newCards = [...list.cards];
              newCards.splice(newPosition, 0, {
                ...cardToMove!,
                listId: newListId,
                position: newPosition,
              });
              
              // Update positions
              return {
                ...list,
                cards: newCards.map((card, index) => ({
                  ...card,
                  position: index,
                })),
              };
            }
            return list;
          });

          const updatedBoard = {
            ...state.currentBoard,
            lists: finalLists,
            updatedAt: new Date(),
          };

          return {
            ...state,
            boards: state.boards.map((board) =>
              board.id === updatedBoard.id ? updatedBoard : board
            ),
            currentBoard: updatedBoard,
          };
        });
      },

      addLabelToCard: (cardId: string, label: Label) => {
        const { updateCard } = get();
        set((state) => {
          if (!state.currentBoard) return state;

          for (const list of state.currentBoard.lists) {
            const card = list.cards.find((c) => c.id === cardId);
            if (card) {
              const existingLabels = card.labels || [];
              if (!existingLabels.find((l) => l.id === label.id)) {
                updateCard(cardId, {
                  labels: [...existingLabels, label],
                });
              }
              break;
            }
          }
          return state;
        });
      },

      removeLabelFromCard: (cardId: string, labelId: string) => {
        const { updateCard } = get();
        set((state) => {
          if (!state.currentBoard) return state;

          for (const list of state.currentBoard.lists) {
            const card = list.cards.find((c) => c.id === cardId);
            if (card && card.labels) {
              updateCard(cardId, {
                labels: card.labels.filter((l) => l.id !== labelId),
              });
              break;
            }
          }
          return state;
        });
      },
    }),
    {
      name: 'kanban-store',
      partialize: (state) => ({
        boards: state.boards,
        currentBoard: state.currentBoard,
      }),
    }
  )
);