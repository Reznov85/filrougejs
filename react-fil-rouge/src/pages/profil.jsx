import axios from "axios";
import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3000";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/utilisateur/profil`, authConfig)
      .then(({ data }) => {
        setMe(data);
        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
        });
      })
      .catch((e) => setErr(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const { data } = await axios.put(
        `${API_URL}/utilisateur/profil`,
        form,
        authConfig
      );
      setMe(data);
      setMsg("Profil mis à jour.");
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      await axios.put(
        `${API_URL}/utilisateur/changepassword`,
        pwd,
        authConfig
      );
      setMsg("Mot de passe modifié.");
      setPwd({ currentPassword: "", newPassword: "" });
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setErr(null);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const { data } = await axios.put(
        `${API_URL}/utilisateur/profil/avatar`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Laisse le navigateur gérer le boundary
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMe(data); // <-- le contrôleur doit renvoyer l'utilisateur mis à jour
      setMsg("Avatar mis à jour.");
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // Si tu stockes un chemin relatif en BDD (ex: "/uploads/avatars/xxx.png")
  const avatarSrc =
    me?.avatar?.startsWith("http")
      ? me.avatar
      : me?.avatar
      ? `${API_URL}${me.avatar}`
      : "https://placehold.co/200x200?text=Avatar";

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-3">
          <span className="animate-spin inline-block h-6 w-6 rounded-full border-4 border-gray-300 border-t-transparent" />
          <span className="text-gray-600">Chargement du profil…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

      {err && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}
      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        {/* Carte avatar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <div className="flex flex-col items-center">
            <img
              className="h-40 w-40 object-cover rounded-full border"
              src={avatarSrc}
              alt={me?.nom || "avatar"}
            />
            <label className="mt-4 inline-block cursor-pointer">
              <span className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">
                Changer l’avatar
              </span>
              <input
                ref={fileRef}
                onChange={uploadAvatar}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form profil */}
        <form
          onSubmit={saveProfile}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">Nom</label>
            <input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-600"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Prénom</label>
            <input
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-600"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-600"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      {/* Changer le mot de passe */}
      <form
        onSubmit={changePassword}
        className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5"
      >
        <h2 className="text-xl font-semibold">Sécurité</h2>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Mot de passe actuel
          </label>
          <input
            value={pwd.currentPassword}
            onChange={(e) =>
              setPwd({ ...pwd, currentPassword: e.target.value })
            }
            type="password"
            className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Nouveau mot de passe
          </label>
          <input
            value={pwd.newPassword}
            onChange={(e) =>
              setPwd({ ...pwd, newPassword: e.target.value })
            }
            type="password"
            className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="flex justify-end">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {saving ? "Mise à jour…" : "Mettre à jour le mot de passe"}
          </button>
        </div>
      </form>
    </div>
  );
}
