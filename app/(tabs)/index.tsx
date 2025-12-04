import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
        <Text className="text-white text-4xl font-bold text-center">
          NativeWind Test
        </Text>
        <Text className="text-white/80 text-center mt-2">
          Tailwind CSS in React Native!
        </Text>
      </View>

      {/* Cards */}
      <View className="p-4 gap-4">
        {/* Card 1 */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Colors & Typography
          </Text>
          <Text className="text-gray-600 text-base">
            This is regular text
          </Text>
          <Text className="text-blue-500 font-semibold mt-2">
            This is blue and semibold
          </Text>
          <Text className="text-red-500 italic">
            This is red and italic
          </Text>
        </View>

        {/* Card 2 */}
        <View className="bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl p-6">
          <Text className="text-white text-xl font-bold">
            Gradients Work!
          </Text>
          <Text className="text-white/90 mt-2">
            Background gradients are supported
          </Text>
        </View>

        {/* Card 3 - Flex Layout */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Flexbox Layout
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-blue-500 p-4 rounded-lg">
              <Text className="text-white text-center font-semibold">Box 1</Text>
            </View>
            <View className="flex-1 bg-green-500 p-4 rounded-lg">
              <Text className="text-white text-center font-semibold">Box 2</Text>
            </View>
            <View className="flex-1 bg-red-500 p-4 rounded-lg">
              <Text className="text-white text-center font-semibold">Box 3</Text>
            </View>
          </View>
        </View>

        {/* Card 4 - Spacing & Sizing */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Spacing & Sizing
          </Text>
          <View className="space-y-3">
            <View className="h-12 bg-purple-500 rounded-lg" />
            <View className="h-16 bg-indigo-500 rounded-lg" />
            <View className="h-20 bg-blue-500 rounded-lg" />
          </View>
        </View>

        {/* Card 5 - Borders */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Borders
          </Text>
          <View className="border-2 border-blue-500 rounded-lg p-4 mb-3">
            <Text className="text-gray-700">Border blue-500</Text>
          </View>
          <View className="border-4 border-red-500 rounded-xl p-4 mb-3">
            <Text className="text-gray-700">Border red-500 (thick)</Text>
          </View>
          <View className="border border-dashed border-green-500 rounded-lg p-4">
            <Text className="text-gray-700">Dashed border green-500</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
