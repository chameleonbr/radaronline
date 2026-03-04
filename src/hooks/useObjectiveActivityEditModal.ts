import { useCallback, useState } from 'react';

type EditModalInputType = 'text' | 'textarea' | 'number';
type ObjectiveField = 'eixo' | 'description' | 'eixoLabel' | 'eixoColor';
type ActivityField = 'title' | 'description';

export interface EditModalConfig {
  isOpen: boolean;
  title: string;
  initialValue: string;
  inputType: EditModalInputType;
  label: string;
  onSave: (value: string) => void;
}

interface UseObjectiveActivityEditModalProps {
  selectedObjective: number;
  handleUpdateObjective: (id: number, newTitle: string) => void;
  handleUpdateObjectiveField: (id: number, field: ObjectiveField, value: string | number) => void;
  handleUpdateActivity: (
    objectiveId: number,
    activityId: string,
    field: ActivityField,
    value: string
  ) => void;
}

const defaultEditModalConfig: EditModalConfig = {
  isOpen: false,
  title: '',
  initialValue: '',
  inputType: 'text',
  label: '',
  onSave: () => {},
};

export function useObjectiveActivityEditModal({
  selectedObjective,
  handleUpdateObjective,
  handleUpdateObjectiveField,
  handleUpdateActivity,
}: UseObjectiveActivityEditModalProps) {
  const [editModalConfig, setEditModalConfig] = useState<EditModalConfig>(defaultEditModalConfig);

  const closeEditModal = useCallback(() => {
    setEditModalConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  const saveEditModal = useCallback((newValue: string) => {
    editModalConfig.onSave(newValue);
    closeEditModal();
  }, [closeEditModal, editModalConfig]);

  const handleEditObjective = useCallback((id: number, currentTitle: string) => {
    setEditModalConfig({
      isOpen: true,
      title: 'Editar Objetivo',
      initialValue: currentTitle,
      inputType: 'text',
      label: 'Novo Titulo',
      onSave: (newTitle) => handleUpdateObjective(id, newTitle),
    });
  }, [handleUpdateObjective]);

  const handleEditObjectiveField = useCallback((
    id: number,
    field: ObjectiveField,
    value: string | number
  ) => {
    if (field === 'eixoColor' || field === 'eixo' || field === 'eixoLabel') {
      handleUpdateObjectiveField(id, field, value);
      return;
    }

    const fieldConfigs: Record<'description', { title: string; label: string; inputType: EditModalInputType }> = {
      description: {
        title: 'Editar Descricao do Objetivo',
        label: 'Descricao',
        inputType: 'textarea',
      },
    };

    const config = fieldConfigs[field];
    if (!config) return;

    setEditModalConfig({
      isOpen: true,
      title: config.title,
      initialValue: String(value),
      inputType: config.inputType,
      label: config.label,
      onSave: (newValue) => {
        handleUpdateObjectiveField(id, field, newValue);
      },
    });
  }, [handleUpdateObjectiveField]);

  const handleEditActivity = useCallback((
    id: string,
    field: ActivityField,
    currentValue: string
  ) => {
    setEditModalConfig({
      isOpen: true,
      title: field === 'title' ? 'Editar Atividade' : 'Editar Descricao',
      initialValue: currentValue,
      inputType: field === 'description' ? 'textarea' : 'text',
      label: field === 'title' ? 'Novo Titulo' : 'Nova Descricao',
      onSave: (newValue) => handleUpdateActivity(selectedObjective, id, field, newValue),
    });
  }, [handleUpdateActivity, selectedObjective]);

  return {
    editModalConfig,
    closeEditModal,
    saveEditModal,
    handleEditObjective,
    handleEditObjectiveField,
    handleEditActivity,
  };
}
