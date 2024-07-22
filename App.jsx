import Navigator from './src/navigation/MainNavigator';
import { UserProvider } from './src/contexts/userContext';

export default function App() {
  return (
    <UserProvider>
      <Navigator />
    </UserProvider>
  );
}
