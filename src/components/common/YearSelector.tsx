import React from 'react';
import { Box, Typography, Slider, Popover } from '@mui/material';

interface YearSelectorProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  selectedYear: number;
  onClose: () => void;
  onChange: (event: Event, newValue: number | number[]) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  open,
  anchorEl,
  selectedYear,
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
        <Typography gutterBottom>年を選択</Typography>
        <Slider
          value={selectedYear}
          onChange={onChange}
          min={2020}
          max={2030}
          step={1}
          marks
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value}年`}
        />
      </Box>
    </Popover>
  );
};

export default YearSelector;
