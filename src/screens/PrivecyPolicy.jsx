import {
    View, ScrollView, Text, Platform, Linking, TouchableOpacity,
    Dimensions, InteractionManager
} from 'react-native'
import React, { useContext, useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from "react-native-paper"
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'
import Loader from '../components/Loader'

const { width } = Dimensions.get('window')

const PrivecyPolicy = () => {

    const { state: layoutState } = useContext(LayoutContext)
    const { colors } = useTheme()
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            });

            return () => task.cancel();
        }, [])
    )

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#fff"
        }}>
            {Platform.OS === 'ios' && <Header title={`COOP Monteral - ${layoutState.isEnglish ? layoutState.EN.privacyPolicy : layoutState.FR.privacyPolicy}`} />}
            <ScrollView contentContainerStyle={{ flexDirection: "row", padding: 10 }}>
                <View style={{ width: "50%", maxWidth: width * 0.45 }}>
                    <Text style={{ fontSize: 25, fontWeight: "700", marginBottom: 10 }}>Privacy Policy</Text>
                    <Text>
                        Mega Taxi built the app as a Free app. This SERVICE is provided by Mega Taxi at no cost and is intended for use as is.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        If you choose to use our Service, then you agree to the collection and use of information in
                        relation to this policy. The Personal Information that we collect is used for providing and improving
                        the Service. We will not use or share your information with anyone except as described
                        in this Privacy Policy.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Information Collection and Use
                    </Text>
                    <Text>
                        For a better experience, while using our Service, we may require you to provide us with certain
                        personally identifiable information. The information that we request will be retained by us and used as described
                        in this privacy policy.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        The app does use third party services that may collect information used to identify you.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Link to privacy policy of third party service providers used by the application
                    </Text>
                    <View style={{ marginTop: 10, marginLeft: 20 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <TouchableOpacity style={{ flexDirection: "row" }}
                                onPress={() => Linking.openURL("https://www.google.com/policies/privacy")}>
                                <Text style={{ color: colors.myOwnColor, textDecorationLine: "underline" }}>
                                    Google Play Service
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <TouchableOpacity style={{ flexDirection: "row" }}>
                                <Text style={{ color: colors.myOwnColor, textDecorationLine: "underline" }}
                                    onPress={() => Linking.openURL("https://firebase.google.com/policies/analytics")}>
                                    Firebase Analytics
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Log Data
                    </Text>
                    <Text>
                        We want to inform you that whenever you use our Service, in a case of
                        an error in the app we collect data and information (through third party products) on your phone
                        called Log Data. This Log Data may include information such as your device Internet Protocol (???IP???) address,
                        device name, operating system version, the configuration of the app when utilizing our Service,
                        the time and date of your use of the Service, and other statistics.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Cookies
                    </Text>
                    <Text>
                        Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers.
                        These are sent to your browser from the websites that you visit and are stored on your device's internal
                        memory.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        This Service does not use these ???cookies??? explicitly. However, the app may use third party code and
                        libraries that use ???cookies??? to collect information and improve their services. You have the option to
                        either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose
                        to refuse our cookies, you may not be able to use some portions of this Service.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Service Providers
                    </Text>
                    <Text>
                        We may employ third-party companies and individuals due to the following reasons:
                    </Text>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                To facilitate our Service;
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                To provide the Service on our behalf;
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                To perform Service-related services; or
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                To assist us in analyzing how our Service is used.
                            </Text>
                        </View>
                    </View>
                    <Text style={{ marginTop: 10 }}>
                        We want to inform users of this Service that these third parties have access to
                        your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However,
                        they are obligated not to disclose or use the information for any other purpose.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Security
                    </Text>
                    <Text>
                        We value your trust in providing us your Personal Information, thus we are striving
                        to use commercially acceptable means of protecting it. But remember that no method of transmission over
                        the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee
                        its absolute security.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Links to Other Sites
                    </Text>
                    <Text>
                        This Service may contain links to other sites. If you click on a third-party link, you will be directed
                        to that site. Note that these external sites are not operated by us. Therefore, we strongly
                        advise you to review the Privacy Policy of these websites. We have no control over
                        and assume no responsibility for the content, privacy policies, or practices of any third-party sites
                        or services.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Children???s Privacy
                    </Text>
                    <Text>
                        These Services do not address anyone under the age of 13. We do not knowingly collect
                        personally identifiable information from children under 13. In the case we discover that a child
                        under 13 has provided us with personal information, we immediately delete this from
                        our servers. If you are a parent or guardian and you are aware that your child has provided us with personal
                        information, please contact us so that we will be able to do necessary actions.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Changes to This Privacy Policy
                    </Text>
                    <Text>
                        We may update our Privacy Policy from time to time. Thus, you are advised to review
                        this page periodically for any changes. We will notify you of any changes by posting
                        the new Privacy Policy on this page. These changes are effective immediately after they are posted on
                        this page.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Contact Us
                    </Text>
                    <Text>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact
                        us: info@megataxi.com
                    </Text>
                </View>



                <View style={{ width: "50%", marginLeft: 10, width: width * 0.45 }}>
                    <Text style={{ fontSize: 25, fontWeight: "700", marginBottom: 10 }}>Politique de confidentialit??</Text>
                    <Text>
                        Mega Taxi a construit le app comme une application gratuite. Ce SERVICE est fourni par Mega Taxi sans frais et destin?? ?? ??tre utilis?? tel quel.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Cette page est utilis??e pour informer les visiteurs de nos politiques en mati??re de collecte, d'utilisation et de divulgation des informations personnelles si quelqu'un d??cide d'utiliser notre service.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Si vous choisissez d'utiliser notre service, vous acceptez la collecte et l'utilisation d'informations relatives ?? cette politique. Les informations personnelles que nous collectons sont utilis??es pour fournir et am??liorer le service. Nous n'utiliserons ni ne partagerons vos informations avec qui que ce soit, sauf dans les cas d??crits dans la pr??sente politique de confidentialit??.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Collecte et utilisation d'informations
                    </Text>
                    <Text>
                        Pour une meilleure exp??rience, lors de l'utilisation de notre service, nous pouvons vous demander de nous fournir certaines informations personnellement identifiables. Les informations que nous demandons seront conserv??es par nous et utilis??es comme d??crit dans cette politique de confidentialit??.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        L'application utilise des services tiers susceptibles de collecter des informations permettant de vous identifier.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Lien vers la politique de confidentialit?? des fournisseurs de services tiers utilis??s par l'application
                    </Text>
                    <View style={{ marginTop: 10, marginLeft: 20 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <TouchableOpacity style={{ flexDirection: "row" }}
                                onPress={() => Linking.openURL("https://www.google.com/policies/privacy")}>
                                <Text style={{ color: colors.myOwnColor, textDecorationLine: "underline" }}>
                                    Google Play Service
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <TouchableOpacity style={{ flexDirection: "row" }}>
                                <Text style={{ color: colors.myOwnColor, textDecorationLine: "underline" }}
                                    onPress={() => Linking.openURL("https://firebase.google.com/policies/analytics")}>
                                    Firebase Analytics
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Donn??es de journal
                    </Text>
                    <Text>
                        Nous souhaitons vous informer que, chaque fois que vous utilisez notre service, en cas d'erreur dans l'application, nous collectons des donn??es et des informations (via des produits tiers) sur votre t??l??phone, appel??es Log Data. Ces donn??es de journal peuvent inclure des informations telles que l'adresse de protocole Internet (??IP??) de votre appareil, le nom de l'appareil, la version du syst??me d'exploitation, la configuration de l'application lors de l'utilisation de notre service, l'heure et la date de votre utilisation du service et d'autres statistiques.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Cookies
                    </Text>
                    <Text>
                        Les cookies sont des fichiers contenant une petite quantit?? de donn??es qui sont couramment utilis??s comme identificateurs uniques anonymes. Ceux-ci sont envoy??s ?? votre navigateur ?? partir des sites Web que vous visitez et sont stock??s dans la m??moire interne de votre appareil.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Ce service n'utilise pas ces ??cookies?? de mani??re explicite. Toutefois, l'application peut utiliser du code tiers et des biblioth??ques qui utilisent des ??cookies?? pour collecter des informations et am??liorer leurs services. Vous avez le choix d'accepter ou de refuser ces cookies et de savoir quand un cookie est envoy?? sur votre appareil. Si vous choisissez de refuser nos cookies, vous ne pourrez peut-??tre pas utiliser certaines parties de ce service.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Les fournisseurs de services
                    </Text>
                    <Text>
                        Nous pouvons employer des soci??t??s tierces et des particuliers pour les raisons suivantes:
                    </Text>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                Pour faciliter notre service;
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                Fournir le service en notre nom;
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                Effectuer des services li??s au service; ou
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{
                                width: 5, height: 5, backgroundColor: colors.dark,
                                marginRight: 10, borderRadius: 2
                            }}></View>
                            <Text style={{ color: colors.dark }}>
                                Pour nous aider ?? analyser la mani??re dont notre service est utilis??.
                            </Text>
                        </View>
                    </View>
                    <Text style={{ marginTop: 10 }}>
                        Nous souhaitons informer les utilisateurs de ce service que ces tiers ont acc??s ?? vos informations personnelles. La raison est d'effectuer les t??ches qui leur sont assign??es en notre nom. Cependant, ils sont oblig??s de ne pas divulguer ni utiliser les informations ?? d'autres fins.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        S??curit??
                    </Text>
                    <Text>
                        Nous appr??cions votre confiance lorsque vous nous fournissez vos informations personnelles. Nous nous effor??ons donc d'utiliser des moyens de protection commercialement acceptables. Mais rappelez-vous qu'aucune m??thode de transmission sur Internet, ni aucune m??thode de stockage ??lectronique n'est s??curis??e et fiable ?? 100%, et nous ne pouvons garantir sa s??curit?? absolue.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Liens vers d'autres sites
                    </Text>
                    <Text>
                        Ce service peut contenir des liens vers d'autres sites. Si vous cliquez sur un lien tiers, vous serez dirig?? vers ce site. Notez que ces sites externes ne sont pas exploit??s par nous. Par cons??quent, nous vous conseillons vivement de consulter la politique de confidentialit?? de ces sites Web. Nous n'avons aucun contr??le sur et n'assumons aucune responsabilit?? pour le contenu, les politiques de confidentialit?? ou les pratiques des sites ou services tiers.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Vie priv??e des enfants
                    </Text>
                    <Text>
                        Ces services ne s'adressent ?? personne de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles concernant des enfants de moins de 13 ans. Si nous d??couvrons qu'un enfant de moins de 13 ans nous a fourni des informations personnelles, nous les supprimons imm??diatement de nos serveurs. Si vous ??tes un parent ou un tuteur et que vous savez que votre enfant nous a fourni des informations personnelles, veuillez nous contacter afin que nous puissions faire les actions n??cessaires.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Changes to This Privacy Policy
                    </Text>
                    <Text>
                        Nous pouvons mettre ?? jour notre politique de confidentialit?? de temps ?? autre. Ainsi, il est conseill?? de consulter cette page p??riodiquement pour tout changement. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialit?? sur cette page. Ces modifications entrent en vigueur imm??diatement apr??s leur publication sur cette page.
                    </Text>
                    <Text style={{ fontWeight: "700", marginVertical: 15 }}>
                        Contactez nous
                    </Text>
                    <Text>
                        Si vous avez des questions ou des suggestions concernant notre politique de confidentialit??, n'h??sitez pas ?? nous contacter: info@megataxi.com
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default PrivecyPolicy