class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private handleMessage: (message: MessageEvent<any>) => void;
    private handleOnConnectionOpen?: (isConnected: boolean) => void;
    constructor(url: string, handleMessage: (message: MessageEvent<any>) => void, 
    handleOnConnectionOpen?: (isConnected: boolean) => void) {
      this.handleOnConnectionOpen = handleOnConnectionOpen;
      this.handleMessage = handleMessage;
      this.url = url;
    }
  
    connect(accessToken?: string): void {
      console.log('Connecting to ws');
      if (typeof window === 'undefined') {
        // Only connect on the client side
        return;
      }
  
      this.socket = new WebSocket(this.url + `?accessToken=${accessToken}`);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection opened.');
        this.handleOnConnectionOpen ? this.handleOnConnectionOpen(true) : (() => {})();
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        this.handleMessage(typeof event.data === 'string' ? JSON.parse(event.data) : event.data);
      };
  
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };
  
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event.reason);
      };
    }
  
    sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      } else {
        console.error('WebSocket is not open. Ready state:', this.socket?.readyState);
      }
    }
  
    disconnect(): void {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  export default WebSocketClient;