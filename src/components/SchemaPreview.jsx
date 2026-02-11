import React from 'react';
import { FileJson } from 'lucide-react';

export default function SchemaPreview({ data, valid = true }) {
    const jsonString = React.useMemo(() => JSON.stringify(data, null, 2), [data]);

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-l border-bg-elevated">
            <div className="p-3 border-b border-bg-elevated/20 flex justify-between items-center text-gray-400">
                <span className="text-xs font-mono font-bold">LIVE JSON PREVIEW</span>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${valid ? 'bg-green-500' : 'bg-red-500'}`} />
                    <FileJson size={14} />
                </div>
            </div>
            <pre className="flex-grow overflow-auto p-4 text-xs font-mono text-blue-300 leading-relaxed selection:bg-blue-900 scrollbar-thin">
                {jsonString}
            </pre>
        </div>
    );
}
