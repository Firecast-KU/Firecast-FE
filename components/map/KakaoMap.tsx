import React from 'react';
import { Platform } from 'react-native';
import KakaoMapMobile from '@/components/map/KakaoMapMobile';
import KakaoMapWeb from '@/components/map/KakaoMapWeb';

export default function KakaoMap() {
  return Platform.OS === 'web' ? <KakaoMapWeb /> : <KakaoMapMobile />;
}
