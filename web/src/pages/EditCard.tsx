import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardForm } from "@/components/cards/CardForm";
import { Card, CardStatus, SimpleCard } from "@/types";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import cardsService from "@/services/cardsService";

const EditCard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | undefined>();

  useEffect(() => {
    cardsService.getCardById(id).then((response) => {
      if (response.success) {
        setCard(response.card);
      } else {
        toast.error(response.error || "Erro ao buscar card");
      }
    });
  }, [id]);

  const handleSubmit = async (data: SimpleCard) => {
    const response = await cardsService.updateCard(card.id, data);
    if (!response.success) {
      toast.error(response.error);
      return;
    }
    toast.success("Card atualizado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {card && (
          <CardForm initialData={card} onSubmit={handleSubmit} isEditing />
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditCard;
