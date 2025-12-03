export interface GuestMessage {
  id: string;
  name: string;
  text: string;
  avatarColor: string;
  date: string;
}

export type ViewState = 'intro' | 'cutting' | 'result';

export interface CakeProps {
  viewState: ViewState;
  onCutComplete: () => void;
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;
}
