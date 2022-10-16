import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const Formulario = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [foto, setFoto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaPersona, setListaPersona] = useState([]);
    const [Editar, setEditar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const getImage = async () => {
        try {
            const res = await fetch('https://picsum.photos/350');
            const data = res.url;
            setFoto(data);
        } catch (error) {
            console.log(error)
        }
    }

    const guardar = async (e) => {
        e.preventDefault()
        try {

            if (nombre.length === 0) {
                alert('El campo nombre se encuentra vacio')
                return
            }
            else if (apellido.length === 0) {
                alert('El campo apellido se encuentra vacio')
                return
            }

            else if (cedula.length === 0) {
                alert('El campo cedula se encuentra vacio')
                return
            }

            else if (telefono.length === 0) {
                alert('El campo telefono se encuentra vacio')
                return
            }

            else if (correo.length === 0) {
                alert('El campo correo se encuentra vacio')
                return
            }

            else if (direccion.length === 0) {
                alert('El campo direccion se encuentra vacio')
                return
            }

            else if (descripcion.length === 0) {
                alert('El campo descripcion se encuentra vacio')
                return

            } else {
                const data = await addDoc(collection(db, 'personas'), {
                    nombreParticipante: nombre,
                    apellidoParticipante: apellido,
                    numeroCedula: cedula,
                    numeroTelefono: telefono,
                    correoElectronico: correo,
                    direccionVivienda: direccion,
                    textoDescripcion: descripcion,
                    foto
                })
                setListaPersona([
                    ...listaPersona,
                    {
                        nombreParticipante: nombre,
                        apellidoParticipante: apellido,
                        numeroCedula: cedula,
                        numeroTelefono: telefono,
                        correoElectronico: correo,
                        direccionVivienda: direccion,
                        textoDescripcion: descripcion,
                        foto,
                        id: data.id
                    }
                ])
                setNombre('')
                setApellido('')
                setCedula('')
                setTelefono('')
                setCorreo('')
                setDireccion('')
                setDescripcion('')
                getImage()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getImage();

        const traerDatos = async () => {
            try {
                await onSnapshot(collection(db, 'personas'), (query) => {
                    setListaPersona(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })
            } catch (error) {
                console.log(error)
            }
        }
        traerDatos();
    }, [])

    const eliminar = async id => {
        try {
            await deleteDoc(doc(db, 'personas', id))
        } catch (error) {
            console.log(error)
        }
    }

    const editarInf = item => {
        setNombre(item.nombreParticipante)
        setApellido(item.apellidoParticipante)
        setCedula(item.numeroCedula)
        setTelefono(item.numeroTelefono)
        setCorreo(item.correoElectronico)
        setDireccion(item.direccionVivienda)
        setDescripcion(item.textoDescripcion)
        setId(item.id)
        setFoto(item.foto)
        setEditar(true)
    }

    const editarDocumento = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const editDoc = doc(db, "personas", id);
            await updateDoc(editDoc, {
                nombreParticipante: nombre,
                apellidoParticipante: apellido,
                numeroCedula: cedula,
                numeroTelefono: telefono,
                correoElectronico: correo,
                direccionVivienda: direccion,
                textoDescripcion: descripcion,
                foto
            })

            const newArray = listaPersona.map(
                item => item.id === id ? {
                    id: id,
                    nombreParticipante: nombre,
                    apellidoParticipante: apellido,
                    numeroCedula: cedula,
                    numeroTelefono: telefono,
                    correoElectronico: correo,
                    direccionVivienda: direccion,
                    textoDescripcion: descripcion,
                    foto
                } : item
            )

            setListaPersona(newArray)
            setNombre('')
            setApellido('')
            setCedula('')
            setTelefono('')
            setCorreo('')
            setDireccion('')
            setDescripcion('')
            setId('')
            setFoto(getImage())
            setEditar(false)
            setTimeout(() => setLoading(false), 2000);
        } catch (error) {
            console.log(error)
        }
    }

    const cancelar = () => {
        setEditar(false)
        setNombre('')
        setApellido('')
        setCedula('')
        setTelefono('')
        setCorreo('')
        setDireccion('')
        setDescripcion('')
        setId('')
        getImage()
    }

    return (
        <div className='container mt-5'>
            <h1 className='text-center'>Concurso De Fotografías</h1>
            <hr />
            {
                loading && (
                    <div className="modal-dialog modal-dialog-centered justify-content-center">
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
            }
            <div className='col-12 justify-content-center d-flex flex-column'>
                <h4 className='text-center'>
                    {
                        Editar ? 'Editar Lista' : 'Agregar Participante'
                    }
                </h4>
                <form onSubmit={Editar ? editarDocumento : guardar} className='d-flex justify-content-center align-self-center flex-column col-4' method='post' action='#'>
                    {/* <div className='col'> */}

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Nombre'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={loading}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Apellido'
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        disabled={loading}
                    />

                    <input type="number"
                        className='mb-2'
                        placeholder='Ingrese Cedula'
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        disabled={loading}
                    />

                    <input type="number"
                        className='mb-2'
                        placeholder='Ingrese Telefono'
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        disabled={loading}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Correo'
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required=""
                        disabled={loading}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Dirección'
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        disabled={loading}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Descripcion'
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        disabled={loading}
                    />
                    <img src={foto} alt="" className='mb-2' disabled={loading} />
                    {
                        Editar ? (
                            <>
                                <button className='btn btn-warning btn-sm float-end  mb-2' type='submit' disabled={loading}>Editar</button>
                                <button className='btn btn-dark btn-sm float-end' onClick={() => cancelar()} disabled={loading}>Cancelar</button>
                            </>
                        ) :
                            <button className='btn btn-primary btn-block' type='submit' disabled={loading}>Agregar</button>

                    }
                    {/* </div> */}

                </form>

            </div>
            <hr className='my-4' />
            <div>
                <h4 className='text-center'>Lista De Participantes</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope='col' className='text-center'>Nombre</th>
                            <th scope='col' className='text-center'>Apellido</th>
                            <th scope='col' className='text-center'>Cedula</th>
                            <th scope='col' className='text-center'>Telefono</th>
                            <th scope='col' className='text-center'>Correo</th>
                            <th scope='col' className='text-center'>Dirección</th>
                            <th scope='col' className='text-center'>Descripcion</th>
                            <th scope='col' className='text-center'>Imagen</th>
                            <th scope='col' className='text-center'>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listaPersona.map(item => (
                                <tr key={item.id}>
                                    <td>{item.nombreParticipante}</td>
                                    <td>{item.apellidoParticipante}</td>
                                    <td>{item.numeroCedula}</td>
                                    <td>{item.numeroTelefono}</td>
                                    <td>{item.correoElectronico}</td>
                                    <td>{item.direccionVivienda}</td>
                                    <td>{item.textoDescripcion}</td>
                                    <td> <img src={item.foto} alt="" className='rounded-circle m-2' height={100} width={100} /></td>
                                    <td className='col d-flex flex-column' >
                                        <button className='btn btn-danger btn-sm float-end mb-2' onClick={() => eliminar(item.id)} disabled={loading}>Eliminar</button>
                                        <button className='btn btn-warning btn-sm float-end  mb-2' onClick={() => editarInf(item)} disabled={loading}>Editar</button>
                                    </td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
                {   /* listaPersona.map(item => (
                <li className='list-group-item row' key={item.id}>

                    <div className='justify-content-around d-flex'>
                        <span>
                            {item.nombreParticipante}
                        </span>
                        <td>
                            {item.numeroCedula}
                        </td>
                        <td>
                            {item.numeroTelefono}
                        </td>
                        <td>
                            {item.correoElectronico}
                        </td>
                        <td>
                            {item.direccionVivienda}
                        </td>
                        <td>
                            {item.textoDescripcion}
                        </td>
                        <img src={item.foto} alt="" className='rounded-circle m-2' height={100} width={100} />
                    </div>

                    <div className='d-flex align-self-center justify-content-end my-2'>
                        <button className='btn btn-danger btn-sm float-end mx-2' onClick={() => eliminar(item.id)}>Eliminar</button>
                        <button className='btn btn-warning btn-sm float-end '>Editar</button>
                    </div>
                </li>
                )) */
                }
            </div>
        </div >
    )
}

export default Formulario