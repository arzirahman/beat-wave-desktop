import { MouseEvent, ReactNode } from "react";
import { FaCaretLeft, FaCaretRight  } from "react-icons/fa";

export type TableProps<Row> = {
    header: { key: string; value: string | ReactNode }[];
    body: Row[];
    bodyFormatter?: (key: string, row: Row) => ReactNode | string;
    clickable?: boolean;
    onRowClick?: (e: MouseEvent<HTMLTableRowElement>, row: any) => void;
    page?: number;
    onNextPage?: (page: number) => void;
    totalPages?: number;
    onPrevPage?: (page: number) => void;
    pagination?: boolean;
};

export const Table = ({ header, body, bodyFormatter, clickable, onRowClick, page, onNextPage, totalPages, onPrevPage, pagination }: TableProps<any>) => {
    return (
        <table className="table table-pin-rows">
            <thead>
                <tr>
                    {header.map((item) => {
                        return (
                            <td className="text-sm text-accent" key={item.key}>{item.value}</td>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {body.map((row) => {
                    return (
                        <tr onClick={(e: MouseEvent<HTMLTableRowElement>) => onRowClick && onRowClick(e, row)} key={Math.floor(Math.random() * 1000000)} className={`${clickable ? "btn-ghost cursor-pointer" : ""}`}>
                            {header.map((col) => {
                                return (
                                    <td key={col.key} className="px-2">
                                        {bodyFormatter ? bodyFormatter(col.key, row) : row[col.key]}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
            {pagination && <tfoot>
                <tr>
                    <th colSpan={header.length}>
                        <div className="flex justify-end w-full">
                            <div className="join">
                                <button onClick={() => {
                                    (page as number) > 1 && onPrevPage && onPrevPage((page as number) - 1)
                                }} className={`${page === 1 ? 'btn-disabled' : ''} border-0 join-item btn btn-ghost bg-base-200 text-primary`}>
                                    <FaCaretLeft size={20} />
                                </button>
                                <button className="border-0 join-item btn hover:bg-base-200 text-base-content bg-base-200">Page {page}</button>
                                <button onClick={() => {
                                    (page as number) < (totalPages as number) && onNextPage && onNextPage((page as number) + 1)
                                }} className={`${page === totalPages ? 'btn-disabled' : ''} border-0 join-item btn btn-ghost bg-base-200 text-primary`}>
                                    <FaCaretRight size={20} />
                                </button>
                            </div>
                        </div>
                    </th>
                </tr>
            </tfoot>}
        </table>
    )
}