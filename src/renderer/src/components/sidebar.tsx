import { useDispatch, useSelector } from 'react-redux'
import logo from '../../../../resources/icon.ico'
import { AppDispatch, RootState } from '@renderer/redux/store'
import { menu, setMenu } from '@renderer/redux/general-slice';

export default function Sidebar(){
    const selectedMenu = useSelector((state: RootState) => state.general.selectedMenu);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="h-full w-[15rem] bg-base-200 flex flex-col gap-8">
            <div className='flex items-center w-full gap-2 px-4 py-6 pb-4'>
                <img className='w-12' alt='Beat Wave' src={logo} />
                <span className='text-3xl font-extrabold text-accent font-dancing-script'>Beat Wave</span>
            </div>
            <div className='flex flex-col flex-1 w-full gap-2'>
                {menu.map((item) => {
                    const isActive = selectedMenu === item.label;
                    
                    return(
                        <button 
                            type='button' 
                            onClick={() => { dispatch(setMenu(item.label as string)) }} 
                            key={item.id} 
                            className="relative justify-start w-full gap-4 px-6 rounded-none btn btn-ghost"
                        >
                            <span className={`${isActive ? 'text-primary' : ''}`}>{item.icon}</span>
                            <span>{item.label}</span>
                            {isActive && <div className='absolute top-0 right-0 w-1 h-full bg-accent'></div>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}