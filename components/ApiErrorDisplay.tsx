import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ApiErrorDisplayProps {
  error: string;
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ error }) => {
  let title = "Произошла ошибка";
  let message = "Не удалось получить анализ от модели ИИ. Пожалуйста, попробуйте еще раз позже.";
  let details = error;
  const lowerCaseError = error.toLowerCase();

  if (lowerCaseError.includes("401")) {
    title = "Неверный API-ключ";
    message = "Предоставленный API-ключ недействителен или не имеет доступа к этому сервису. Пожалуйста, проверьте правильность ключа.";
  } else if (lowerCaseError.includes("402") || lowerCaseError.includes("insufficient balance")) {
    title = "Недостаточно средств";
    message = "На балансе вашего аккаунта для этого сервиса ИИ закончились средства. Пожалуйста, пополните баланс для продолжения работы.";
  } else if (lowerCaseError.includes("429") || lowerCaseError.includes("insufficient_quota")) {
    title = "Превышена квота";
    message = "Вы исчерпали лимит запросов, доступный по вашему тарифному плану. Пожалуйста, проверьте ваш план и биллинг в личном кабинете сервиса.";
  } else if (lowerCaseError.includes("400") && lowerCaseError.includes("not a valid model id")) {
    title = "Модель ИИ недоступна";
    message = "Выбранная модель временно недоступна или ее идентификатор устарел. Пожалуйста, попробуйте выбрать другую модель для анализа.";
  }

  return (
    <div className="bg-red-900/40 text-red-300 p-4 rounded-lg border border-red-700/50 flex items-start space-x-4">
        <div className="flex-shrink-0 text-red-500">
            <AlertTriangleIcon />
        </div>
        <div>
            <h4 className="font-bold text-red-200">{title}</h4>
            <p className="text-sm mt-1">{message}</p>
            <details className="mt-3 text-xs">
                <summary className="cursor-pointer hover:text-red-100">Технические детали</summary>
                <p className="mt-1 opacity-70 break-all">{details}</p>
            </details>
        </div>
    </div>
  );
};

export default ApiErrorDisplay;