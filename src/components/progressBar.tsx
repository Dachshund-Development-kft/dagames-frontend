import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    startColor: string;
    endColor: string;
    length?: Int32Array | string;
    showValue?: boolean;
    numberType?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
    value, 
    max, 
    startColor, 
    endColor, 
    length = '100%', 
    showValue = false,
    numberType = ''
}) => {
    const percentage = (value / max) * 100;

    const interpolateColor = (start: string, end: string, percent: number) => {
        const startRGB = hexToRgb(start);
        const endRGB = hexToRgb(end);

        if (!startRGB || !endRGB) return startColor;

        const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * (percent / 100));
        const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * (percent / 100));
        const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * (percent / 100));

        return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    const currentColor = interpolateColor(startColor, endColor, percentage);

    return (
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden relative" style={{ width: typeof length === 'string' ? length : `${length.length}px` }}>
            <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: currentColor }} />
            {showValue && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    {`${value+' '+numberType}`}
                </span>
            )}
        </div>
    );
};

export default ProgressBar;