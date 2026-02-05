import { useNavigate } from "react-router-dom";
import { CardForm } from "@/components/cards/CardForm";
import { SimpleCard } from "@/types";
import { toast } from "sonner";
import cardsService from "@/services/cardsService";

const CreateCard = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: SimpleCard) => {
    const response = await cardsService.createCard(data);
    if (!response.success) {
      toast.error(response.error || "Erro ao criar card");
      return;
    }
    toast.success("Card criado com sucesso!");
    navigate("/dashboard");
  };

  return (
      <div className="max-w-2xl mx-auto">
        <CardForm onSubmit={handleSubmit} />
      </div>
  );
};

export default CreateCard;
