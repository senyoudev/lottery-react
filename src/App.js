import './App.css';
import web3 from './utils/web3'
import lottery from './utils/lottery';
import { useEffect,useState } from 'react';

function App() {
  const [manager,setManager] = useState("")
  const [players,setPlayers] = useState([])
  const [balance,setBalance] = useState("")
  const [amount,setAmount] = useState("")

  useEffect(() => {
    const manageFunc = async() => {
      const managerName = await lottery.methods.manager().call() //_ethAccounts.givenProvider.selectedAddress
      const player = await lottery.methods.getPlayers().call()
      const balanceTotal = await web3.eth.getBalance(lottery.options.address)
      setPlayers(player)
      setManager(managerName)
      setBalance(balanceTotal)
    }
    manageFunc()
  },[])
  let i = 0;

  const onSubmit = async(e) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, "ether"),
    });
    setAmount('')
    console.log('You entered')
  }

  const onChange = (e) => {
    setAmount(e.target.value)
  }

  const onClick = async() => {
    const accounts = await web3.eth.getAccounts()
    console.log('picking a winner...')
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    })

    console.log('A winner is picked')
  }
  return (
    <div className='app'>
        <h1 className='title'>Lottery contract App</h1>
        <p className='title2'>This app is created by <strong>{manager}</strong> </p>
        <p className='title2'>This app now has  <strong>{players.length}</strong> players </p>
         {players.length > 0 ? (<h1 className='title2'>  ====Their addresses=====</h1>) : <h1 className='title2'>No players yet</h1> }
        {players.map(p => (
          <p key={p+i++} className='title2'>address:{p}</p>
        ))}
        <h2 className="title">These players are competing to win <strong>{web3.utils.fromWei(balance,'ether')}</strong> ether </h2>
        <div className="form-group">
            <h1>Wanna try your luck ?</h1>
          <form onSubmit={onSubmit}>
            <label >Amout of ether u want to send</label>
            <input
              type="text"
              value={amount}
              onChange={onChange}
             />
             <br />
             <button type='submit'>Enter</button>
          </form>
        </div>
        <div className="winner">
          <h1 className='title'>
            Pick a winner
          </h1>
          <button onClick={onClick}>pick winner</button>
        </div>
    </div>
  );
}

export default App;
