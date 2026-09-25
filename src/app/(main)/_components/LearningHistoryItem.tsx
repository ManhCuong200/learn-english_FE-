import Link from 'next/link';
import { BookOpen, Brain, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LearningHistoryItem as ILearningHistoryItem, LearningActivityType } from '@/types/learning-history';

type LearningHistoryItemProps = {
  item: ILearningHistoryItem;
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

const getActivityConfig = (type: LearningActivityType) => {
  switch (type) {
    case 'VOCABULARY':
      return {
        label: 'Vocabulary',
        icon: BookOpen,
        colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        iconBgClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500',
      };
    case 'FLASHCARD':
      return {
        label: 'Flashcard',
        icon: Brain,
        colorClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        iconBgClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500',
      };
    case 'QUIZ':
      return {
        label: 'Quiz',
        icon: HelpCircle,
        colorClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        iconBgClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500',
      };
    default:
      return {
        label: 'Activity',
        icon: BookOpen,
        colorClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
        iconBgClass: 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400',
      };
  }
};

export const LearningHistoryItem = ({ item }: LearningHistoryItemProps) => {
  const config = getActivityConfig(item.type);
  const Icon = config.icon;

  const renderAction = () => {
    if (item.type === 'VOCABULARY' && item.referenceId) {
      return (
        <Link 
          href={`/learning/vocabulary/${item.referenceId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-3"
        >
          View word <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
      <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${config.iconBgClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <Badge variant="outline" className={`font-semibold px-2.5 py-0.5 border ${config.colorClass}`}>
            {config.label}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
        
        <h3 className="text-base font-bold text-foreground mb-1 truncate">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        {renderAction()}
      </div>
    </div>
  );
};
