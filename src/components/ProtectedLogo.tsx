import logo from '@/assets/logo.svg';

interface ProtectedLogoProps {
  className?: string;
  height?: number;
}

const ProtectedLogo = ({ className = '', height = 40 }: ProtectedLogoProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Actual logo image */}
      <img
        src={logo}
        alt="Мастерская сувениров"
        width={120}
        height={height}
        className="h-full w-auto select-none pointer-events-none"
        style={{ 
          userSelect: 'none',
        }}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
      {/* Protective overlay */}
      <div 
        className="absolute inset-0 z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ cursor: 'default' }}
      />
    </div>
  );
};

export default ProtectedLogo;
