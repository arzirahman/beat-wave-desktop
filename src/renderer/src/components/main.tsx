import { menu } from "@renderer/redux/general-slice";
import { RootState } from "@renderer/redux/store"
import { useSelector } from "react-redux"

export default function Main(){
    const selectedMenu = useSelector((state: RootState) => state.general.selectedMenu);

    return(
        <>
            {menu.map((item) => (
                <div key={item.id} className={`${item.label !== selectedMenu ? 'hidden' : ''} flex-1 h-full overflow-auto`}>
                    {item.element}
                </div>
            ))}
        </>
    )
}