import { IS_DOCKER_HOSTED } from '@novu/shared-web';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStepFormPath } from '../hooks/useStepFormPath';
import { useTemplateEditorForm } from './TemplateEditorFormProvider';

export const InputVariablesForm = ({ onChange }: { onChange?: (data: any) => void }) => {
  const stepFormPath = useStepFormPath();
  const { watch } = useFormContext();
  const { template } = useTemplateEditorForm();
  const inputs = watch(`${stepFormPath}.template.inputs.schema`) || {};
  const stepId = watch(`${stepFormPath}.stepId`);
  const _stepId = watch(`${stepFormPath}._id`);
  const formData = useMemo(() => {
    return {
      _workflowId: template?._id,
      workflowId: template?.triggers[0].identifier,
      stepId,
      _stepId,
    };
  }, [stepId, _stepId, template]);

  if (IS_DOCKER_HOSTED) {
    return null;
  }

  try {
    const module = require('@novu/ee-billing-web');
    const InputVariablesComponent = module.InputVariablesForm;

    return (
      <>
        <InputVariablesComponent schema={inputs} formData={formData} onChange={onChange} />
      </>
    );
  } catch (e) {}

  return null;
};
