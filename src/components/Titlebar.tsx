import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Titlebar({settings, audios, setAudios, hoveredButton, setHoveredButton, setModalShow, setModalType}:any) {
    // FUNCTION
    const handleMinimize = async () => {
        await getCurrentWindow().minimize();
    };
    const handleClose = async () => {
        await getCurrentWindow().close();
    };
    const handleStop = async () => {
        audios.forEach((audio:any) => {
            audio.pause();
            audio.currentTime = 0;
        });
        setAudios([]);
    };
    const handleSettings = () => {
        setModalType("settingsAudio");
        setModalShow(true);
    };

    // RENDER
    return (
        <div className="bg-red h-[37px] w-full flex justify-between">
            <div className="flex flex-row gap-[15px]">
                <button onMouseMove={() => setHoveredButton("Settings")} onMouseLeave={() => setHoveredButton("")} onClick={handleSettings} className="w-[37px] h-[37px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[10px] shadow-[inset_0px_0px_14px_10px_rgba(256,_256,_256,_0.08)] flex justify-center items-center cursor-pointer"><img src={document.querySelector("#hidden-settings")?.getAttribute("src") ?? undefined}/></button>
                <button onMouseMove={() => setHoveredButton("Stop all sounds")} onMouseLeave={() => setHoveredButton("")} onClick={handleStop} className="w-[37px] h-[37px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[10px] shadow-[inset_0px_0px_14px_10px_rgba(256,_256,_256,_0.08)] flex justify-center items-center cursor-pointer"><img src={document.querySelector("#hidden-stop")?.getAttribute("src") ?? undefined}/></button>
            </div>
            <p className="max-w-[300px] font-[Inter] font-bold text-[17px] text-[#BAC2DE] leading-[37px] truncate">{settings["displayHoverName"] ? hoveredButton : ""}</p>
            <div className="flex flex-row gap-[15px]">
                <button onClick={handleMinimize} className="w-[37px] h-[37px] bg-[#DF8E1D]/8 border-[2px] border-[#DF8E1D]/40 rounded-[10px] shadow-[inset_0px_0px_14px_10px_rgba(256,_256,_256,_0.08)] flex justify-center items-center cursor-pointer"><img src={document.querySelector("#hidden-minimize")?.getAttribute("src") ?? undefined}/></button>
                <button onClick={handleClose} className="w-[37px] h-[37px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[10px] shadow-[inset_0px_0px_14px_10px_rgba(256,_256,_256,_0.08)] flex justify-center items-center cursor-pointer"><img src={document.querySelector("#hidden-close")?.getAttribute("src") ?? undefined}/></button>
            </div>
        </div>
    );
}