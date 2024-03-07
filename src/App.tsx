import FactsSearch from './components/FactsSearch/FactsSearch';
import AgeSearch from './components/AgeSearch/AgeSearch';
import { SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { FunctionComponent, useState } from 'react';

const App: FunctionComponent = () => {
  const [activePanel, setActivePanel] = useState<string>('facts');

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <FactsSearch id='facts' setActivePanel={setActivePanel} />
          <AgeSearch id='age' setActivePanel={setActivePanel} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
}

export default App;
