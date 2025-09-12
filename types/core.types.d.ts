// Small Tab Switcher component
type TabItem = {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?(index: number): void;
  ariaLabel?: string;
  className?: string;
};
