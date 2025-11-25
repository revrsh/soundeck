import { useEffect, useState } from "react";
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

export default function DropMenu({show, cord, type, data, setData, audios, setAudios, page, folder, buttonToEdit, setModalShow, setModalType, setWarningShow, setWarningType}:any) {
    // VARIABLE
    const [volumeInput, setVolumeInput] = useState<number>(0);
    
    // FUNCTION
    const handleNewSound = async () => {
        setModalShow(true);
        setModalType("addSound");
    };

    const handleNewFolder = async () => {
        setModalShow(true);
        setModalType("addFolder");
    };

    const handleEditSound = async () => {
        setModalShow(true);
        setModalType("editSound");
    };

    const handleEditFolder = async () => {
        setModalShow(true);
        setModalType("editFolder");
    };

    const handleDelete = async (type:string) => {
        if(type == "sound") {
            setWarningType("deleteSound");
        } else if(type == "folder") {
            setWarningType("deleteFolder");
        }
        setWarningShow(true);
    };

    const handleStop = async () => {
        audios.filter((audio:any) => audio["id"] == `${folder}-${page}-${buttonToEdit}`).forEach((audio:any) => {
            audio.pause();
            audio.currentTime = 0;
        });
        setAudios(audios.filter((audio:any) => audio["id"] !== `${folder}-${page}-${buttonToEdit}`));
    };

    const handleVolumeChange = async (value:any) => {
        setVolumeInput(value.target.value);
        audios.filter((audio:any) => audio["id"] == `${folder}-${page}-${buttonToEdit}`).forEach((audio:any) => {
            audio.volume = value.target.value / 100;
        });
        setAudios(audios);
    };

    const handleVolumeMouseUp = async () => {
        data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["volume"] = volumeInput;
        await writeTextFile('deckData.json', JSON.stringify(data), { baseDir: BaseDirectory.AppConfig });
        setData(data);
    };

    useEffect(() => {
        if(show) {
            if(type == "editSound") {
                const button = data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page);
                setVolumeInput(button[0]["volume"]);
            }
        }
    }, [show]);
    
    // RENDER
    if(type == "new") {
        return (
            <div style={{top: `${cord[0]}px`, left: `${cord[1]}px`, display: show ? "unset" : "none"}} className="overflow-hidden absolute w-[105px] h-fit flex flex-col bg-[#11111B] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 shadow-[0px_0px_18px_8px_rgba(0,_0,_0,_0.2)]">
                <button onClick={handleNewFolder} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer font-[Inter] text-[#FFFFFF]/80 text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-folder-menu")?.getAttribute("src") ?? undefined}/>Folder</button>
                <button onClick={handleNewSound} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer bg-[#FFFFFF]/5 font-[Inter] text-[#FFFFFF]/80 text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-sound-menu")?.getAttribute("src") ?? undefined}/>Sound</button>
            </div>
        );
    } else if(type == "editFolder") {
        return (
            <div style={{top: `${cord[0]}px`, left: `${cord[1]}px`, display: show ? "unset" : "none"}} className="overflow-hidden absolute w-[105px] h-fit flex flex-col bg-[#11111B] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 shadow-[0px_0px_18px_8px_rgba(0,_0,_0,_0.2)]">
                <button onClick={handleEditFolder} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer font-[Inter] text-[#FFFFFF]/80 text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-edit-menu")?.getAttribute("src") ?? undefined}/>Edit</button>
                <button onClick={() => handleDelete("folder")} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer bg-[#FFFFFF]/5 font-[Inter] text-[#D20F39] text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-delete-menu")?.getAttribute("src") ?? undefined}/>Delete</button>
            </div>
        );
    } else if(type == "editSound") {
        return (
            <div style={{top: `${cord[0]}px`, left: `${cord[1]}px`, display: show ? "unset" : "none"}} className="overflow-hidden absolute w-[105px] h-fit flex flex-col bg-[#11111B] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 shadow-[0px_0px_18px_8px_rgba(0,_0,_0,_0.2)]">
                <div className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px]">
                   <input value={volumeInput} onMouseUp={() => handleVolumeMouseUp()} onChange={(value) => handleVolumeChange(value)} style={{background: `linear-gradient(to right, #89B4FA80 ${volumeInput-3}%, #BAC2DE66 ${volumeInput}%)`}} className="w-full h-[7px] appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#89B4FA]" type="range" name="volume" id="volumeDropMenu" min={0} max={100} />
                </div>
                <button onClick={handleEditSound} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer bg-[#FFFFFF]/5 font-[Inter] text-[#FFFFFF]/80 text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-edit-menu")?.getAttribute("src") ?? undefined}/>Edit</button>
                <button onClick={handleStop} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer font-[Inter] text-[#FFFFFF]/80 text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-stop-menu")?.getAttribute("src") ?? undefined}/>Stop</button>
                <button onClick={() => handleDelete("sound")} className="w-full h-[35px] flex flex-row items-center px-[10px] gap-[10px] cursor-pointer bg-[#FFFFFF]/5 font-[Inter] text-[#D20F39] text-[15px] font-bold leading-[35px]"><img src={document.querySelector("#hidden-delete-menu")?.getAttribute("src") ?? undefined}/>Delete</button>
            </div>
        );
    }
}