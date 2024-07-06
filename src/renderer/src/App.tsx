import Main from "./components/main"
import MusicPlayer from "./components/music-player"
import Sidebar from "./components/sidebar"

function App(): JSX.Element {
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-base-300">
      <div className="flex flex-1 w-full overflow-auto">
        <Sidebar />
        <Main />
      </div>
      <MusicPlayer />
    </div>
  )
}

export default App
