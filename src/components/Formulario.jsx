import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const Formulario = () => {
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [foto, setFoto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaPersona, setListaPersona] = useState([]);
    const getImage = async () => {
        try {
            const res = await fetch('https://picsum.photos/300');
            const data = res.url;
            setFoto(data);
        } catch (error) {

        }
    }

    const guardar = async (e) => {
        e.preventDefault()
        try {
            const data = await addDoc(collection(db, 'personas'), {
                nombreParticipante: nombre,
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
            setCedula('')
            setTelefono('')
            setCorreo('')
            setDireccion('')
            setDescripcion('')
            setFoto('')
            getImage()
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
        setCedula(item.numeroCedula)
        setTelefono(item.numeroTelefono)
        setCorreo(item.correoElectronico)
        setDireccion(item.direccionVivienda)
        setDescripcion(item.textoDescripcion)
    }

    return (
        <div className='container mt-5'>
            <h1 className='text-center'>Concurso De Fotografías</h1>
            <hr />
            <div className='col-12 justify-content-center d-flex flex-column' >
                <h4 className='text-center'>Agregar Participante</h4>
                <form onSubmit={guardar} className='d-flex justify-content-center align-self-center flex-column col-4 '>
                    {/* <div className='col'> */}
                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Nombre'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}

                    />

                    <input type="number"
                        className='mb-2'
                        placeholder='Ingrese Cedula'
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />

                    <input type="number"
                        className='mb-2'
                        placeholder='Ingrese Telefono'
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Correo'
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Dirección'
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />

                    <input type="text"
                        className='mb-2'
                        placeholder='Ingrese Descripcion'
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />

                    <img src={foto} alt="" className='mb-2' />

                    <button className='btn btn-primary btn-block' type='submit'>Agregar</button>
                    {/* </div> */}

                </form>
            </div>
            <hr className='my-4' />
            <div>
                <h4 className='text-center'>Lista De Participantes</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope='col'>Nombre Completo</th>
                            <th scope='col'>Cedula</th>
                            <th scope='col'>Telefono</th>
                            <th scope='col'>Correo</th>
                            <th scope='col'>Dirección</th>
                            <th scope='col'>Descripcion</th>
                            <th scope='col'>Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listaPersona.map(item => (
                                <tr key={item.id}>
                                    <td>{item.nombreParticipante}</td>
                                    <td>{item.numeroCedula}</td>
                                    <td>{item.numeroTelefono}</td>
                                    <td>{item.correoElectronico}</td>
                                    <td>{item.direccionVivienda}</td>
                                    <td>{item.textoDescripcion}</td>
                                    <td> <img src={item.foto} alt="" className='rounded-circle m-2' height={100} width={100} /></td>
                                    <td className='col d-flex flex-column' >
                                        <button className='btn btn-danger btn-sm float-end mb-2' onClick={() => eliminar(item.id)}>Eliminar</button>
                                        <button className='btn btn-warning btn-sm float-end '>Editar</button>
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