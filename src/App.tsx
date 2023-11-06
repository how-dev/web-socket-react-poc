import React from 'react';
import './App.css';

interface Message {
  nickname: string;
  message: string;
}

const App = () => {
  const emptyMessage: Message = {nickname: '', message: ''};
  const websocketUrl = '...';
  
  const [ws] = React.useState<WebSocket>(
    new WebSocket(websocketUrl)
  );
  const [nickname, setNickname] = React.useState<string>('');
  const [message, setMessage] = React.useState<Message>(emptyMessage);
  const [messages, setMessages] = React.useState<Message[]>([]);
  
  React.useEffect(() => {
    ws.onopen = () => {
      console.log('connected');
    }
    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages([...messages, message]);
    };
  })
  
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ws.send(JSON.stringify(message));
    setMessage(emptyMessage);
  }
  
  const renderMessage = (message: Message, key: number) => (
    <li key={key}>{message.nickname}: {message.message}</li>
  );
  
  return (
    <div className="App">
      <main className="App-header">
        <input
          type="text"
          value={nickname}
          onChange={
            (e) => {
              setNickname(e.target.value)
            }
          }
        />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message.message}
            onChange={
              (e) => {
                setMessage({nickname, message: e.target.value})
              }
            }/>
          <button type="submit">Send</button>
        </form>
        <ul>
          {messages.map(renderMessage)}
        </ul>
      </main>
    </div>
  );
}

export default App;
