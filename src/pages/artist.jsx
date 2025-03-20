import { Operations } from '../components/operations';
import '../components/components.css';

export function ArtistOperations() {
  const operations = [
    {
      title: 'Add Artist',
      description: 'Add a new artist to the museum collection',
      icon: '➕',
      path: '/login/artist/add-artist',
    },
    {
      title: 'Remove Artist',
      description: 'Remove an existing artist from the collection',
      icon: '❌',
      path: '/login/artist/remove-artist'
    },
    {
      title: 'Modify Artist',
      description: 'Update information for an existing artist',
      icon: '✏️',
      path: '/login/artist/modify-artist'
    }
  ];

  return (
    <Operations title="Artist" operations={operations}/>
  )
}