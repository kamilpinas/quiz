import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles';
import React, {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
const _ = require('lodash');

function RankScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [rankScore, setRankScore] = useState([]);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        fetch('http://tgryl.pl/quiz/' + 'results')
          .then((response) => response.json())
          .then((json) => setRankScore(json.reverse()))
          .catch((error) => console.error(error));
      } else {
        ToastAndroid.showWithGravity(
          'no network!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      }
    });
    return () => {};
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(100).then(() => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected == true) {
          fetch('http://tgryl.pl/quiz/' + 'results')
            .then((response) => response.json())
            .then((json) => setRankScore(json.reverse()))
            .catch((error) => console.error(error));
          setRefreshing(false);
          ToastAndroid.showWithGravity(
            'Odswieżono!',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        } else {
          ToastAndroid.showWithGravity(
            'No network!',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
          setRefreshing(false);
        }
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flex: 1, marginLeft: 10}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Image
              source={require('../icons/undo.png')}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={[{flex: 13, alignItems: 'center'}]}>
          <Text style={styles.headerText}>Ranking</Text>
        </View>
      </View>
      <View style={[styles.content, {margin: 20}]}>
        <SafeAreaView
          style={{border: 'groove'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={[{flexDirection: 'row', justifyContent: 'center'}]}>
            <TouchableOpacity
              style={[
                styles.centerMode,
                styles.border,
                {
                  height: 40,
                  width: 80,
                  backgroundColor: '#BCE0AA',
                },
              ]}>
              <Text style={styles.font22}>Nick</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.centerMode,
                styles.border,
                {width: 80, backgroundColor: '#BCE0AA'},
              ]}>
              <Text style={styles.font22}>Wynik</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.centerMode,
                styles.border,
                {width: 80, backgroundColor: '#BCE0AA'},
              ]}>
              <Text style={styles.font22}>Rodzaj</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.centerMode,
                styles.border,
                {width: 100, backgroundColor: '#BCE0AA'},
              ]}>
              <Text style={styles.font22}>Data</Text>
            </TouchableOpacity>
          </View>
          {createResults(rankScore)}
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

function createResults(data) {
  const renderItem = ({item, index}) => (
    <View style={[{flex: 1}]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.border, {width: 80}]}>{item.nick}</Text>
        <Text style={[styles.border, {width: 80}]}>
          {item.score + '/' + item.total}
        </Text>
        <Text style={[styles.border, {width: 80}]}>{item.type}</Text>
        <Text style={[styles.border, {width: 100}]}>{item.date}</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}
export default RankScreen;
