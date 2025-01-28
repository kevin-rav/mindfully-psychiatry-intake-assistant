import { Button } from "~/components/ui/button";

interface FormHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function FormHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-m font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>{buttonText}</Button>
      )}
    </div>
  );
}
