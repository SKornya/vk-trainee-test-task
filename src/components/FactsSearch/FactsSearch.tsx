import {
  Button,
  CellButton,
  FormItem,
  Group,
  Panel,
  PanelHeader,
  Textarea,
} from '@vkontakte/vkui';
import { FunctionComponent, useRef } from 'react';

const FACTS_API_URL = 'https://catfact.ninja/fact';

interface Fact {
  fact: string;
  length: number;
}

const FactsSearch: FunctionComponent<{
  id: string;
  setActivePanel: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setActivePanel, id }) => {
  const clickHandle = async () => {
    try {
      const response = await fetch(FACTS_API_URL);

      if (!response.ok) {
        throw Error(`Error with status: ${response.status}`);
      }

      const data: Fact = await response.json();

      if (textAreaRef.current) {
        const { fact } = data;

        textAreaRef.current.value = fact;
        textAreaRef.current.focus();

        const firstSpaceIndex = fact.indexOf(' ');
        const focusPosition =
          firstSpaceIndex !== -1 ? firstSpaceIndex + 1 : fact.length;
        textAreaRef.current.setSelectionRange(focusPosition, focusPosition);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Panel id={id}>
      <PanelHeader>Random fact search</PanelHeader>
      <Group>
        <FormItem>
          <Button onClick={clickHandle}>Get fact</Button>
        </FormItem>
        <FormItem>
          <Textarea
            getRef={textAreaRef}
            style={{ resize: 'none' }}
            name="fact"
            id="fact"
            rows={10}
          ></Textarea>
        </FormItem>
      </Group>

      <CellButton onClick={() => setActivePanel('age')}>
        Go to search age by username
      </CellButton>
    </Panel>
  );
};

export default FactsSearch;
