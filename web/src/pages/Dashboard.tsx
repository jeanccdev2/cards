import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardItem } from "@/components/cards/CardItem";
import { FloatingRecordButton } from "@/components/recording/FloatingRecordButton";
import { RecordingModal } from "@/components/recording/RecordingModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/types";
import { Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import cardsService from "@/services/cardsService";

type StatusFilter = "all" | "done" | "undone" | "doing";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  const filteredCards =
    filter === "all" ? cards : cards.filter((card) => card.status === filter);

  const statusCounts = {
    all: cards.length,
    done: cards.filter((c) => c.status === "done").length,
    undone: cards.filter((c) => c.status === "undone").length,
    doing: cards.filter((c) => c.status === "doing").length,
  };

  const filterButtons: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "done", label: "Feitos" },
    { key: "doing", label: "Fazendo" },
    { key: "undone", label: "Pendentes" },
  ];

  const listCards = () => {
    cardsService
      .fetchCards()
      .then((response) => setCards(response.cards || []));
  };

  useEffect(() => {
    listCards();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meus Cards</h1>
            <p className="text-muted-foreground">
              Gerencie seus cards e tarefas
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/cards/new")}
            className="gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Card
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filterButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
              className={cn(
                "transition-all",
                filter === key && "gradient-primary",
              )}
            >
              {label}
              <span
                className={cn(
                  "ml-2 px-1.5 py-0.5 rounded-full text-xs",
                  filter === key ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {statusCounts[key]}
              </span>
            </Button>
          ))}
        </div>

        {/* Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card, index) => (
              <div
                key={card.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardItem card={card} onDeleteCard={listCards} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum card encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "Crie seu primeiro card usando o botão acima ou grave sua voz."
                : "Não há cards com este status."}
            </p>
            {filter === "all" && (
              <Button onClick={() => navigate("/dashboard/cards/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro card
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating Record Button */}
      <FloatingRecordButton onClick={() => setIsRecordingModalOpen(true)} />

      {/* Recording Modal */}
      <RecordingModal
        open={isRecordingModalOpen}
        onOpenChange={setIsRecordingModalOpen}
        onCardsGenerated={listCards}
      />
    </>
  );
};

export default Dashboard;
