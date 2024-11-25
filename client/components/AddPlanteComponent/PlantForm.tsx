import React, {useState, useEffect} from "react";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {StyleSheet, Switch} from "react-native";
import FilePreview from "@/components/AddPlanteComponent/FilePreview";
import {ThemedText} from "@/components/ThemedText";

// Déclaration des types des données du formulaire
type Inputs = {
    name: string;
    waterByDayPercentage: number;
    image: File | null; // Modifié pour accepter un seul fichier
    description: string;
    humidityRateSensorId: string; // ID du capteur
    waterRetentionCoefficient: number;
    autoWatering: boolean;
};

export default function PlantForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<Inputs>();

    // États pour gérer l'image, son aperçu, et les capteurs
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null); // Aperçu sous forme d'URL

    // Fonction exécutée lors de la soumission du formulaire
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log("Données soumises :", data);

        // Créez un objet FormData
        const formData = new FormData();

        // Ajoutez les autres données au FormData
        formData.append("name", data.name);
        formData.append("waterByDayPercentage", String(data.waterByDayPercentage)); // Humidité en tant que chaîne
        formData.append("waterRetentionCoefficient", String(data.waterByDayPercentage)); // Humidité en tant que chaîne
        formData.append("description", String(data.description));
        formData.append("autoWatering", String(data.autoWatering));

        // Ajoutez l'image au FormData (si présente)
        if (file) {
            formData.append("image", file); // L'image est envoyée en tant que fichier
        }

        try {
            // Effectuer la requête POST
            const response = await fetch("http://localhost:8080/api/plant", {
                method: "POST",
                body: formData, // Données à envoyer
            });

            if (response.ok) {
                alert("Formulaire soumis avec succès !");
                console.log(await response.json()); // Réponse du serveur
                setFile(null);
                setPreview(null);
            } else {
                alert("Erreur lors de l'envoi des données.");
            }
        } catch (error) {
            console.error("Erreur de requête :", error);
            alert("Erreur de communication avec le serveur.");
        }
    };

    // Gestion du changement de fichier dans le parent
    const handleFileChange = (file: File | null) => {
        setFile(file); // Met à jour le fichier dans l'état
        if (file) {
            const objectUrl = URL.createObjectURL(file); // Crée un aperçu de l'image
            setPreview(objectUrl); // Met à jour l'aperçu de l'image
        } else {
            setPreview(null); // Supprime l'aperçu si aucun fichier n'est sélectionné
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.formStyle} id="formData">
            <label className="flex flex-col" style={styles.labelStyle}>
                <ThemedText>
                    <span className="font-medium">Nom de la plante :</span>
                </ThemedText>
                <div style={{display: "contents"}}>
                    <input
                        id="name"
                        style={styles.inputStyle}
                        placeholder="Entrez le nom de la plante"
                        {...register("name", {required: "Le nom est obligatoire"})}
                        className={`border p-2 rounded ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm" style={styles.warningStyle}>
                            {errors.name.message}
                        </span>
                    )}
                </div>
            </label>

            {/* Champ : Taux d'humidité */}
            <label className="flex flex-col" style={styles.labelStyle}>
                <ThemedText>
                    <span className="font-medium">Taux d'humidité (%) :</span>
                </ThemedText>

                <div style={{display: "contents"}}>
                    <input
                        style={styles.inputStyle}
                        type="number"
                        id="humdity"
                        placeholder="Entrez le taux d'humidité"
                        {...register("waterByDayPercentage", {
                            required: "Le taux d'humidité est obligatoire",
                            min: {value: 0, message: "La valeur doit être au moins 0"},
                            max: {value: 100, message: "La valeur ne peut pas dépasser 100"},
                        })}
                        className={`border p-2 rounded ${errors.waterByDayPercentage ? "border-red-500" : ""}`}
                    />
                </div>
                {errors.waterByDayPercentage && (
                    <span className="text-red-500 text-sm" style={styles.warningStyle}>
                        {errors.waterByDayPercentage.message}
                    </span>
                )}
            </label>

            <label className="flex flex-col" style={styles.labelStyle}>
                <ThemedText>
                    <span className="font-medium">Description de la plante :</span>
                </ThemedText>
                <div style={{display: "contents"}}>
                    <textarea
                        id="descirption"
                        style={styles.inputStyle}
                        placeholder="Entrez la description de la plante"
                        {...register("description", {required: "Le nom est obligatoire"})}
                        className={`border p-2 rounded ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                        <span className="text-red-500 text-sm" style={styles.warningStyle}>
                            {errors.description.message}
                        </span>
                    )}
                </div>
            </label>

            {/* Champ : Rétention d'eau du sol */}
            <label className="flex flex-col" style={styles.labelStyle}>
                <ThemedText>
                    <span className="font-medium">Rétention d'eau du sol (%):</span>
                </ThemedText>
                <div style={{display: "contents"}}>
                    <input
                        id="waterRetentionCoefficient"
                        style={styles.inputStyle}
                        placeholder="Entrez le coefficient de rétention d'eau"
                        {...register("waterRetentionCoefficient", {
                            required: "Le coefficient de rétention d'eau est obligatoire",
                            min: {value: 0, message: "La valeur doit être au moins 0"},
                            max: {value: 100, message: "La valeur ne peut pas dépasser 100"}
                        })}
                        className={`border p-2 rounded ${errors.waterRetentionCoefficient ? "border-red-500" : ""}`}
                    />
                    {errors.waterRetentionCoefficient && (
                        <span className="text-red-500 text-sm" style={styles.warningStyle}>
                            {errors.waterRetentionCoefficient.message}
                        </span>
                    )}
                </div>
            </label>

            <label className="flex flex-col" style={styles.labelStyle}>
                <ThemedText>
                    <span className="font-medium">Arrosage automatique :</span>
                </ThemedText>
                <Controller
                    name="autoWatering"
                    control={control}
                    defaultValue={false}
                    render={({field}) => (
                        <Switch
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                        />
                    )}
                />
            </label>

            {/* Champ : Image */}
            <div style={{display: "contents", width: 400}}>
                <FilePreview
                    handleFileChange={handleFileChange}
                    preview={preview}
                    errorMessage={errors.image?.message}
                />
            </div>

            {/* Bouton de soumission */}
            <button
                type="submit"
                style={styles.buttonStyle}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Soumettre
            </button>
        </form>
    );
}

const styles = StyleSheet.create({
    inputStyle: {
        paddingVertical: 8,
        paddingLeft: 8,
        paddingRight: 8,
        marginTop: 8,
        marginBottom: 8,
        height: 60,
        borderRadius: 8,
    },
    labelStyle: {
        color: "white",
        flexDirection: "column",
        display: "flex",
        marginTop: 16,
    },
    formStyle: {
        paddingTop: 50,
    },
    buttonStyle: {
        width: "100%",
        height: 40,
        marginTop: 8,
        borderRadius: 8,
    },
    warningStyle: {
        color: "orange",
    },
});
