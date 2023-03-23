import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import Chart2 from './app/components/Chart2';

export default function App() {
  return (
    <View style={styles.container}>
   <Chart2/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#baf',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
