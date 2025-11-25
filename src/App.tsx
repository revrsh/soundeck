import { useEffect, useState } from "react";
import "./App.css";
import Titlebar from "./components/Titlebar";
import Deck from "./components/Deck";
import { BaseDirectory, writeTextFile, readTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { appConfigDir } from '@tauri-apps/api/path';
import DropMenu from "./components/DropMenu";
import Modal from "./components/Modal";
import Warning from "./components/Warning";

const appConfigDirPath = await appConfigDir();

function App() {
  // VARIABLE
  const [page, setPage] = useState<number>(0);
  const [folder, setFolder] = useState<string>("root");
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [audios, setAudios] = useState<any>([]);
  const [buttonToEdit, setButtonToEdit] = useState<number>(0);
  const [hoveredButton, setHoveredButton] = useState<string>("");

  const [dropMenuShow, setDropMenuShow] = useState<boolean>(false);
  const [dropMenuCord, setDropMenuCord] = useState<number[]>([0, 0]);
  const [dropMenuType, setDropMenuType] = useState<string>("");

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const [warningShow, setWarningShow] = useState<boolean>(false);
  const [warningType, setWarningType] = useState<string>("");

  // FUNCTION
  useEffect(() => {
    (async () => {
      if(!(await exists(appConfigDirPath))) {
        await mkdir('', { baseDir: BaseDirectory.AppConfig });
      }
      if(!(await exists(`${appConfigDirPath}/deckData.json`))) {
        await writeTextFile('deckData.json', '[]', { baseDir: BaseDirectory.AppConfig });
      }
      if(!(await exists(`${appConfigDirPath}/settings.json`))) {
        await writeTextFile('settings.json', '{"globalVolume": 100, "displayHoverName": true}', { baseDir: BaseDirectory.AppConfig });
      }
      if(data == null) {
        setData(JSON.parse(await readTextFile('deckData.json', { baseDir: BaseDirectory.AppConfig })));
      }
      if(settings == null) {
        setSettings(JSON.parse(await readTextFile('settings.json', { baseDir: BaseDirectory.AppConfig })));
      }
      if(data !== null && settings !== null && ready == false) {
        setReady(true);
      }
    })()
  });

  useEffect(() => {
    window.addEventListener("mouseup", (e) => {
      if((e.target as HTMLInputElement).name !== "volume") {
        setDropMenuShow(false);
      }
    });
  });

  // RENDER
  if(ready) {
    return (
      <main className="bg-[#11111B] rounded-[33px] border-[1.5px] border-[#2C2D36] w-full h-screen relative overflow-hidden">
        <Warning data={data} setData={setData} show={warningShow} setShow={setWarningShow} type={warningType} audios={audios} setAudios={setAudios} parent={folder} page={page} buttonToEdit={buttonToEdit}/>
        <Modal data={data} setData={setData} settings={settings} setSettings={setSettings} show={modalShow} setShow={setModalShow} type={modalType} setType={setModalType} parent={folder} page={page} buttonToEdit={buttonToEdit} setWarningShow={setWarningShow} setWarningType={setWarningType} />
        <div className="w-full h-full p-[40px] flex flex-col gap-[26px]">
          <Titlebar settings={settings} audios={audios} setAudios={setAudios} hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} setModalShow={setModalShow} setModalType={setModalType} />
          <Deck page={page} setPage={setPage} folder={folder} setFolder={setFolder} data={data} setData={setData} audios={audios} setAudios={setAudios} setDropMenuShow={setDropMenuShow} setDropMenuCord={setDropMenuCord} setDropMenuType={setDropMenuType} setButtonToEdit={setButtonToEdit} setHoveredButton={setHoveredButton} modalShow={modalShow} />
          <DropMenu setShow={setDropMenuShow} show={dropMenuShow} cord={dropMenuCord} type={dropMenuType} data={data} setData={setData} audios={audios} setAudios={setAudios} page={page} folder={folder} buttonToEdit={buttonToEdit} setModalShow={setModalShow} setModalType={setModalType} setWarningShow={setWarningShow} setWarningType={setWarningType}/>
        </div>
      </main>
    );
  }
}

export default App;