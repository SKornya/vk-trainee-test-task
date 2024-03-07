import {
  Button,
  CellButton,
  FormItem,
  FormStatus,
  Group,
  Input,
  Panel,
  PanelHeader,
} from '@vkontakte/vkui';
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';

const AGE_SEARCH_API_URL = 'https://api.agify.io/';

const AgeSearch: FunctionComponent<{
  id: string;
  setActivePanel: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setActivePanel, id }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [lastRequestedName, setLastRequestedName] = useState<string>('');

  const [age, setAge] = useState<number | null>(null);

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandle = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);

    if (abortController) {
      abortController.abort();
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      if (username === lastRequestedName) {
        return;
      }

      console.log(/^[a-zA-Z]+$/.test(username));

      if (!/^[a-zA-Z]+$/.test(username)) {
        throw Error('Invalid input pattern! Username may contains only letters');
      }

      setIsLoading(true);

      const response = await fetch(`${AGE_SEARCH_API_URL}?name=${username}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      setLastRequestedName(username);
      setAge(data.age);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        setError(`${error.message}`);
      }
    }

    setAbortController(null);
    setIsLoading(false);
  };

  const changeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setUsername(event.target.value);
  };

  useEffect(() => {
    const DELAY = 3000;

    const timerId: number = setTimeout(() => {
      submitHandle({ preventDefault: () => {} } as FormEvent);
    }, DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [username]);

  return (
    <Panel id={id}>
      <PanelHeader>User age search</PanelHeader>
      <Group>
        <form onSubmit={submitHandle}>
          <FormItem>
            <Input
              onChange={changeHandle}
              value={username}
              style={{ resize: 'none' }}
              name="ageSearch"
              id="ageSearch"
            ></Input>
          </FormItem>
          {!isLoading && username && !error && (
            <FormStatus
              mode="default"
              style={{ textAlign: 'center' }}
            >{`Age of ${username}: ${age ? age : 'unknown'}`}</FormStatus>
          )}
          {error && <FormStatus mode="error">{error}</FormStatus>}
          <FormItem>
            <Button>Get age by username</Button>
          </FormItem>
        </form>
      </Group>

      <CellButton onClick={() => setActivePanel('facts')}>
        Go to random facts
      </CellButton>
    </Panel>
  );
};

export default AgeSearch;
