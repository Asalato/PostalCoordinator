import {
    Box,
    Button, Divider,
    Flex,
    Heading,
    HStack,
    Link, Slider,
    SliderFilledTrack, SliderMark, SliderThumb,
    SliderTrack,
    Spacer,
    Text,
    VStack
} from "@chakra-ui/react";
import {ShareButton} from "../ShareButton";
import React, {useEffect, useState} from "react";
import {getCurrentGame, getDailyGame, getHighScore} from "../ScoreStore";
import {Navigate, useNavigate} from "react-router-dom";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import {LatLng, LatLngBounds, Map} from "leaflet";
import {selectIcon, targetIcon} from "../leaflet/CustomIcons";
import {BiWorld} from "react-icons/bi";

const mapStyle = {
    maxWidth: "100%",
    aspectRatio: "3/2",
    margin: "10pt",
}

export const Result: React.FC<{ isDaily?: boolean }> = ({isDaily}) => {
    const navigate = useNavigate();
    const currentGame = isDaily || isDaily !== undefined ? getDailyGame() : getCurrentGame();

    if (currentGame == null) return <Navigate replace to="/"/>

    const allPlaces = currentGame.stages.flatMap(s => [s.selected, s.address.coordinate]);
    const sw = new LatLng(Math.min(...allPlaces.map(p => p.latitude)), Math.min(...allPlaces.map(p => p.longitude)));
    const ne = new LatLng(Math.max(...allPlaces.map(p => p.latitude)), Math.max(...allPlaces.map(p => p.longitude)));
    const bounds = new LatLngBounds(sw, ne);

    const score = currentGame.getTotalScore();

    return (
        <VStack direction="column" spacing="15pt">
            <Heading fontSize="2xl" marginTop="10pt">リザルト</Heading>
            <Text>{currentGame.day && (isDaily || isDaily !== undefined) ? `デイリーチャレンジ: ${currentGame.day.getFullYear()}/${currentGame.day.getMonth() + 1}/${currentGame.day.getDate()}` : `ゲームID: ${currentGame.id}`}</Text>
            <Box w="100%">
                <MapContainer bounds={bounds} style={mapStyle}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        currentGame.stages.map((s, i) => {
                            const correctPosition = new LatLng(s.address.coordinate.latitude, s.address.coordinate.longitude);
                            const selectedPosition = new LatLng(s.selected.latitude, s.selected.longitude);

                            return (
                                <Box key={i}>
                                    <Marker position={correctPosition} icon={targetIcon}>
                                        <Popup>
                                            第{i}ステージ：正解
                                            [{s.address.details?.prefecture} {s.address.details?.city} {s.address.details?.address}]
                                        </Popup>
                                    </Marker>
                                    <Marker position={selectedPosition} icon={selectIcon}>
                                        <Popup>
                                            第{i}ステージ：選択
                                            ({selectedPosition.lat.toFixed(2)}, {selectedPosition.lng.toFixed(2)})
                                        </Popup>
                                    </Marker>
                                    <Polyline positions={[correctPosition, selectedPosition]} color="green"/>
                                </Box>
                            )
                        })
                    }
                </MapContainer>
            </Box>
            <Flex w="80%">
                <Slider aria-label='slider-ex-1' defaultValue={score} min={0} max={25000}
                        marginBottom="0.5rem" isReadOnly>
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb boxSize={5}>
                        <Box color="teal" as={BiWorld}/>
                    </SliderThumb>
                    <SliderMark value={score} textAlign='center' mt='-9' ml='-5' w='12' fontSize="lg">
                        {(score / 250).toFixed(0)}%
                    </SliderMark>
                    <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>0</SliderMark>
                    <SliderMark value={5000} mt='1' ml='-2.5' fontSize='sm'>5000</SliderMark>
                    <SliderMark value={10000} mt='1' ml='-2.5' fontSize='sm'>10000</SliderMark>
                    <SliderMark value={15000} mt='1' ml='-2.5' fontSize='sm'>15000</SliderMark>
                    <SliderMark value={20000} mt='1' ml='-2.5' fontSize='sm'>20000</SliderMark>
                    <SliderMark value={25000} mt='1' ml='-2.5' fontSize='sm'>25000</SliderMark>
                </Slider>
            </Flex>
            <Text fontSize="lg" textAlign="center">
                最終スコア：{score.toFixed(0)}<br/>
                (最高スコア：{getHighScore().toFixed(0)})
            </Text>
            <Divider/>
            <Box>
                <ShareButton result={currentGame} isDaily={currentGame.day && (isDaily || isDaily !== undefined)}/>
            </Box>
            <HStack>
                <Button colorScheme='teal' variant='outline' onClick={() => navigate("/game")}>
                    新しいゲームを開始
                </Button>
                <Button colorScheme='teal' variant='outline' onClick={() => navigate("/")}>
                    トップに戻る
                </Button>
            </HStack>
        </VStack>
    )
}
