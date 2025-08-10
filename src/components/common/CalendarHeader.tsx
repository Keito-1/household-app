import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onYearClick: (event: React.MouseEvent<HTMLElement>) => void;
  onMonthClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onYearClick,
  onMonthClick
}) => {
  return (
    <Box sx={(theme) => ({ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 2,
      [theme.breakpoints.down('sm')]: {
        mb: 1
      }
    })}>
      <IconButton 
        onClick={onPreviousMonth}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            padding: 1
          }
        })}
      >
        <ChevronLeft />
      </IconButton>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          variant="h5" 
          component="h2"
          onClick={onYearClick}
          sx={(theme) => ({ 
            cursor: 'pointer', 
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s',
            fontSize: { 
              xs: 'clamp(1rem, 4vw, 1.25rem)', 
              sm: 'clamp(1.25rem, 3.5vw, 1.5rem)',
              md: 'clamp(1.5rem, 3vw, 2rem)'
            }
          })}
        >
          {currentDate.getFullYear()}年
        </Typography>
        <Typography 
          variant="h5" 
          component="h2"
          onClick={onMonthClick}
          sx={(theme) => ({ 
            cursor: 'pointer', 
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s',
            fontSize: { 
              xs: 'clamp(1rem, 4vw, 1.25rem)', 
              sm: 'clamp(1.25rem, 3.5vw, 1.5rem)',
              md: 'clamp(1.5rem, 3vw, 2rem)'
            }
          })}
        >
          {currentDate.getMonth() + 1}月
        </Typography>
      </Box>
      
      <IconButton 
        onClick={onNextMonth}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            padding: 1
          }
        })}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default CalendarHeader;
