import React from 'react';
import { Box, Typography, Slider, Popover } from '@mui/material';

interface MonthSelectorProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  selectedMonth: number;
  onClose: () => void;
  onChange: (event: Event, newValue: number | number[]) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  open,
  anchorEl,
  selectedMonth,
  onClose,
  onChange
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box sx={{ p: 3, width: 300 }}>
        <Typography gutterBottom>月を選択</Typography>
        <Slider
          value={selectedMonth}
          onChange={onChange}
          min={0}
          max={11}
          step={1}
          marks={[
            { value: 0, label: '1月' },
            { value: 1, label: '2月' },
            { value: 2, label: '3月' },
            { value: 3, label: '4月' },
            { value: 4, label: '5月' },
            { value: 5, label: '6月' },
            { value: 6, label: '7月' },
            { value: 7, label: '8月' },
            { value: 8, label: '9月' },
            { value: 9, label: '10月' },
            { value: 10, label: '11月' },
            { value: 11, label: '12月' },
          ]}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value + 1}月`}
        />
      </Box>
    </Popover>
  );
};

export default MonthSelector;
