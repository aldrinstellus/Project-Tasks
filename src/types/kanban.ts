export interface Label {
  id: string;
  title: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  labels?: Label[];
  dueDate?: Date;
  listId: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  position: number;
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Add userId to associate boards with users
}

export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  
  // Board actions
  createBoard: (title: string, userId: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  loadUserBoards: (userId: string) => void; // Load boards for specific user
  
  // List actions
  createList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  moveList: (listId: string, newPosition: number) => void;
  
  // Card actions
  createCard: (listId: string, title: string, description?: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, newListId: string, newPosition: number) => void;
  
  // Label actions
  addLabelToCard: (cardId: string, label: Label) => void;
  removeLabelFromCard: (cardId: string, labelId: string) => void;
}