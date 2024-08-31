'use client';

import { CopyIcon } from "@radix-ui/react-icons";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const CopyToClipboard = ({
    value
}: {
    value: string
}) => {
    const [isCopied, setIsCopied] = useState(false);
    useEffect(() => {
        if (isCopied)
            setTimeout(() => setIsCopied(false), 400);
    }, [isCopied]);
    if (isCopied) {
        return <CheckCircle className="h-4 w-4 text-green-400 transition-all" />
    }
    return (
        <CopyIcon className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            onClick={() => {
                navigator.clipboard.writeText(value);
                setIsCopied(true);
            }}
        />
    )
}

export default CopyToClipboard;