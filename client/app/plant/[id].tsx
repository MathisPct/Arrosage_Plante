import React, { useState, useEffect } from 'react';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button, StyleSheet, Switch, Linking } from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import SliderComponent from "@/app/plant/Slider";
import { arroserPlante, deletePlante, infoPlant, editPlanteHumidity } from "@/components/API_Auth/api";
import { router } from 'expo-router';

export default function PlantDetail() {
    const [plante, setPlante] = useState<any>(null);
    const [displayEdit, setDisplayEdit] = useState(false);
    const { id } = useLocalSearchParams();


    useEffect(() => {
        const fetchPlantDetails = async () => {
            try {
                const response = await infoPlant(id);
                setPlante(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la plante', error);
            }
        };

        fetchPlantDetails();
    }, [id]);

    const handleArroser = async () => {
        try {
            await arroserPlante(id, plante);
            setDisplayEdit(false);
        } catch (error) {
            if(error.response.status === 400) {
                alert(error.response.data);
            } else {
                alert('Erreur lors de l\'arrosage de la plante');
            }
        }
    };

    const handleChange = () => {
        console.log(plante.automaticWatering);
        setPlante((prevPlante) => ({
            ...prevPlante,
            automaticWatering: !prevPlante.automaticWatering,
        }));
        setDisplayEdit(true);
    };
    const handleDelete = async () => {
        try {
            await deletePlante(id, plante);
            router.replace('/');
        } catch (error) {
            alert('Erreur lors de la suppression de la plante');
        }
    };

    const handleEdit = async () => {
        try {
            await editPlanteHumidity(id, plante.waterByDayPercentage,plante.automaticWatering);
            setDisplayEdit(false);
        } catch (error) {
            alert("Erreur lors de la modification de l'humidité de la plante");
        }
    }

    const handleHumidityChange = (value) => {
        setPlante({
            ...plante,
            waterByDayPercentage: parseInt(value)
        })
        console.log(plante);
        setDisplayEdit(true);
    }

    if (!plante) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText type="subtitle">Chargement des informations de la plante...</ThemedText>
            </ThemedView>
        );
    }

    const urlImage = `http://localhost:8080/api/plant/${id}/image`;


    return (
        <>
            <Stack.Screen options={{ title: "Détail d'une plante" }} />
            <ThemedView style={styles.container}>
                <div style={styles.header}>
                    <img
                        style={styles.headerImage}
                        src={urlImage || "https://fastly.picsum.photos/id/305/4928/3264.jpg?hmac=s2FLjeAIyYH0CZl3xuyOShFAtL8yEGiYk31URLDxQCI"}
                        alt="Image d'illustration de la plante"
                    />
                    <SliderComponent humidityRate={plante.humidityRate} />
                </div>
                <ThemedText type="subtitle" style={{ paddingTop: 10 }}>
                    {plante.name || "Nom de la plante"}
                </ThemedText>
                <ThemedText type="default" style={{ marginBottom: 10 }}>
                    {plante.description || "Description de la plante"}
                </ThemedText>
                <label style={{ marginBottom: 10 }}>
                    <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
                        Arrosage automatique
                    </ThemedText>
                <Switch
                    onValueChange={handleChange}
                    value={plante.automaticWatering}
                />
                </label>

                <label style={styles.labelWithInput}>
                    <ThemedText type="subtitle">Taux d'humidité journalier</ThemedText>
                    <input
                        type="number"
                        onInput={(e) => handleHumidityChange(e.target.value)}
                        value={plante.waterByDayPercentage}
                        style={styles.input}
                    />
                </label>
                <div style={styles.waterButton}>
                    <Button title={"Arroser"} onPress={handleArroser} />
                </div>
                <div style={styles.actionsDataButtons}>
                    { displayEdit && <Button onPress={handleEdit} title={"Modifier"} color={"blue"} /> }
                    <Button onPress={handleDelete} title={"Supprimer"} color={"red"} />
                </div>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: 'column',
        gap: 8,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingTop: 8,
        paddingBottom: 16
    },
    labelWithInput: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    },
    input: {
        borderRadius: 8,
        height: 40,
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 16,
        paddingRight: 16,
    },
    headerImage: {
        maxWidth: "70%",
        objectFit: 'cover',
        marginLeft: -20,
        height: 300,
        borderRadius: 8,
    },
    waterButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    actionsDataButtons: {
        position: 'absolute',
        bottom: 8,
        left: 8,
    }
});
