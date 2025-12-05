import React from 'react';
import { format } from 'date-fns';
import { CaptionProps, useNavigation } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomCaptionProps extends CaptionProps {
    onMonthChange?: (date: Date) => void;
}

const CustomCaption = (props: CustomCaptionProps) => {
    const { displayMonth, onMonthChange } = props;
    const { goToMonth, nextMonth, previousMonth } = useNavigation();

    const handlePreviousClick = () => {
        if (previousMonth) {
            goToMonth(previousMonth);
            onMonthChange?.(previousMonth);
        }
    };

    const handleNextClick = () => {
        if (nextMonth) {
            goToMonth(nextMonth);
            onMonthChange?.(nextMonth);
        }
    };

    return (
        <div className="flex items-center justify-between pt-1 relative">
            <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={handlePreviousClick}
                disabled={!previousMonth}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
                {format(displayMonth, 'MMMM yyyy')}
            </span>
            <Button
                variant="outline"
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                onClick={handleNextClick}
                disabled={!nextMonth}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CustomCaption;
