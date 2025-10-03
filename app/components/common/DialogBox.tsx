import { AlertTriangle } from 'lucide-react';
import ButtonLoader from './ButtonLoader';

export default function DialogBox({
    isOpen,
    message,
    onYes,
    onNo,
    loader,
}: {
    isOpen: boolean;
    message: string;
    onYes: () => void;
    onNo: () => void;
    loader?: boolean;
}) {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="relative flex flex-col items-center justify-center rounded-xl bg-white p-6 z-50">
                    <span className="mb-2">
                        <AlertTriangle color="red" width={30} height={30} />
                    </span>
                    <h2 className="text-xl text-black font-bold">
                        Confirmation
                    </h2>
                    <p className="mt-1 text-md text-black font-normal text-center">
                        {message}
                    </p>
                    <div className="flex justify-between items-center gap-4 mt-4 w-full">
                        <button
                            type="button"
                            className="flex-1 rounded-lg border px-4 py-2 text-black hover:bg-amber-500 hover:text-white"
                            onClick={onYes}
                            disabled={loader}
                        >
                            {loader ? <ButtonLoader /> : 'Yes'}
                        </button>
                        <button
                            type="button"
                            className="flex-1 rounded-lg border px-4 py-2 text-black hover:bg-amber-500 hover:text-white"
                            onClick={onNo}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}
