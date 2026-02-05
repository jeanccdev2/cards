import { Card } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Card as CardUI,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import cardsService from "@/services/cardsService";
import { toast } from "sonner";

interface CardItemProps {
  card: Card;
}

export const CardItem = ({ card }: CardItemProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/cards/${card.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este card?")) {
      cardsService.deleteCard(card.id).then((response) => {
        if (!response.success) {
          toast.error(response.error || "Erro ao excluir card");
          return;
        }
        toast.success("Card excluído com sucesso");
        navigate("/dashboard");
      });
    }
  };

  return (
    <CardUI className="card-hover group relative overflow-hidden border shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
            {card.title}
          </CardTitle>
          <StatusBadge status={card.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {card.content}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {format(card.created_at, "d 'de' MMM, yyyy", { locale: ptBR })}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </CardUI>
  );
};
