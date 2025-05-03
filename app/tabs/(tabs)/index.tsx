import { Dimensions, ScrollView, View } from 'react-native';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { LineChart } from "react-native-chart-kit";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const screenWidth = Dimensions.get('window').width;
const moodEmojis = ["😁", "😊", "🙂", "😐", "😞"];
const moodIcons = [
  {
    name: 'face-sad-cry',
    bg: '#fee2e2',
    color: '#b91c1c'
  },
  {
    name: 'face-frown',
    bg: '#fef9c3',
    color: '#92400e'
  },
  {
    name: 'face-smile',
    bg: '#d1fae5',
    color: '#065f46'
  },
  {
    name: 'face-grin-beam',
    bg: '#cffafe',
    color: '#155e75'
  },
  {
    name: 'face-laugh-squint',
    bg: '#dbeafe',
    color: '#1e40af'
  },
];

export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      <Box className="px-4">
        {/* 欢迎卡片 */}
        <Card className="p-5 rounded-2xl mb-4 shadow-md">
          <Text className="text-base text-gray-700 mb-4">
            Today, you have a long day with multiple tasks, take breaks to breathe and relax!
          </Text>
          <Button>
            <ButtonText>See your tasks for today</ButtonText>
          </Button>
        </Card>

        {/* 情绪选择模块 */}
        <Card className="p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="text-base font-semibold mb-2 text-gray-800">
            How are you feeling today?
          </Text>
          <Box className="flex-row justify-between mt-2">
            {moodIcons.map((icon, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: icon.bg,
                  borderRadius: 12,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                }}
              >
                <FontAwesome6 name={icon.name} size={22} color={icon.color} />
              </View>
            ))}
          </Box>
        </Card>

        {/* 情绪趋势图 */}
        <Card className="p-5 rounded-2xl shadow-sm">
          <Text className="text-center text-lg font-bold mb-4 text-gray-900">Mood Trend</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Emoji Y轴 */}
            <View
              style={{
                position: 'absolute',
                left: 28,
                top: 0,
                bottom: 0,
                zIndex: 1,
              }}
            >
              {moodEmojis.map((mood, index) => (
                <Text key={index} style={{ fontSize: 18, paddingTop: index === 0 ? 8 : 24 }}>{mood}</Text>
              ))}
            </View>

            {/* 图表区域 */}
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: [3, 4, 2, 5, 4, 3, 4] }],
              }}
              width={screenWidth - 64}
              height={240}
              fromZero
              withVerticalLabels
              withHorizontalLabels={false}
              withInnerLines
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#dbeafe',
                backgroundGradientTo: '#f0f9ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3b82f6',
                },
              }}
              bezier
              style={{
                borderRadius: 8,
              }}
            />
          </View>
        </Card>
      </Box>
    </ScrollView>
  );
}