// repository.test.ts
import {
    fetchUserData,
    createEvent,
    fetchUserIdEvents,
    updateUserData,
    fetchAllEvents,
    fetchAllRequests,
    deleteRequest,
    deleteEvent,
    fetchTodaysEvents,
    uploadProfileImage,
    updateUserProfileImageUrl,
    fetchUserProfileImageUrl,
    updateEvent
  } from './repository';
  
  // Mock Firebase modules
  jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    where: jest.fn(),
    query: jest.fn(),
    deleteDoc: jest.fn(),
    Timestamp: {
      fromDate: jest.fn((date) => ({ date }))
    }
  }));
  
  jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
    listAll: jest.fn(),
    deleteObject: jest.fn()
  }));
  
  jest.mock('@/app/firebase/config', () => ({
    db: {},
    auth: {}
  }));
  
  jest.mock('browser-image-resizer', () => ({
    readAndCompressImage: jest.fn()
  }));
  
  jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid')
  }));
  
  // Import mocked modules for direct access in tests
  import {
    doc, getDoc, updateDoc, collection, addDoc, getDocs, where, query, deleteDoc, Timestamp
  } from 'firebase/firestore';
  import {
    getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject
  } from 'firebase/storage';
  import { readAndCompressImage } from 'browser-image-resizer';
  
  describe('Repository Functions', () => {
    // Reset all mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Common mock implementations
      (doc as jest.Mock).mockReturnValue('mocked-doc-ref');
      (collection as jest.Mock).mockReturnValue('mocked-collection-ref');
      (query as jest.Mock).mockReturnValue('mocked-query');
      (ref as jest.Mock).mockReturnValue('mocked-storage-ref');
    });
  
    describe('fetchUserData', () => {
      it('should fetch user data successfully', async () => {
        // Mock user document data
        const mockUserData = {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          phone: '123-456-7890',
          organizer: true
        };
        
        // Mock getDoc to return success
        (getDoc as jest.Mock).mockResolvedValue({
          exists: () => true,
          data: () => mockUserData
        });
        
        // Call the function
        const result = await fetchUserData('user123');
        
        // Verify doc was called with correct params
        expect(doc).toHaveBeenCalledWith({}, 'users', 'user123');
        
        // Verify getDoc was called
        expect(getDoc).toHaveBeenCalledWith('mocked-doc-ref');
        
        // Verify result
        expect(result).toEqual(mockUserData);
      });
  
      it('should return null if user document does not exist', async () => {
        // Mock getDoc to return non-existent document
        (getDoc as jest.Mock).mockResolvedValue({
          exists: () => false
        });
        
        // Call the function
        const result = await fetchUserData('nonexistent-user');
        
        // Verify result
        expect(result).toBeNull();
      });
  
      it('should handle errors when fetching user data', async () => {
        // Mock getDoc to throw error
        (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        const result = await fetchUserData('user123');
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching user data:', 
          expect.any(Error)
        );
        
        // Verify result
        expect(result).toBeNull();
      });
    });
  
    describe('createEvent', () => {
      it('should create an event successfully', async () => {
        // Mock event data
        const mockEvent = {
          user: 'user123',
          title: 'Test Event',
          description: 'Test Description',
          date: new Date('2023-05-15'),
          start: new Date('2023-05-15T09:00:00'),
          end: new Date('2023-05-15T10:00:00'),
          area: 'Test Area',
          location: 'Test Location',
          food_provider: ['Provider 1'],
          food_type: ['Pizza'],
          followers: ['user456']
        };
        
        // Mock addDoc to return document reference with ID
        (addDoc as jest.Mock).mockResolvedValue({
          id: 'event123'
        });
        
        // Call the function
        const result = await createEvent(mockEvent);
        
        // Verify collection was called with correct collection
        expect(collection).toHaveBeenCalledWith({}, 'events');
        
        // Verify addDoc was called with event data including defaults
        expect(addDoc).toHaveBeenCalledWith(
          'mocked-collection-ref',
          expect.objectContaining({
            user: 'user123',
            title: 'Test Event',
            description: 'Test Description',
            area: 'Test Area',
            location: 'Test Location',
            food_provider: ['Provider 1'],
            food_type: ['Pizza'],
            followers: ['user456'],
            reminder_sent: false,
            availability: 'high'
          })
        );
        
        // Verify the created event has the ID from Firestore
        expect(result).toEqual(expect.objectContaining({
          ...mockEvent,
          id: 'event123'
        }));
      });
  
      it('should handle errors when creating an event', async () => {
        // Mock event data
        const mockEvent = {
          user: 'user123',
          title: 'Test Event',
          description: 'Test Description',
          date: new Date('2023-05-15'),
          start: new Date('2023-05-15T09:00:00'),
          end: new Date('2023-05-15T10:00:00'),
          area: 'Test Area',
          location: 'Test Location',
          food_provider: ['Provider 1'],
          food_type: ['Pizza'],
          followers: ['user456']
        };
        
        // Mock addDoc to throw error
        (addDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        const result = await createEvent(mockEvent);
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error creating event: ', 
          expect.any(Error)
        );
        
        // Verify result
        expect(result).toBeNull();
      });
    });
  
    describe('fetchUserIdEvents', () => {
      it('should fetch events for a user successfully', async () => {
        // Mock event data
        const mockEventData = [
          {
            id: 'event1',
            user: 'user123',
            title: 'Event 1'
          },
          {
            id: 'event2',
            user: 'user123',
            title: 'Event 2'
          }
        ];
        
        // Mock query setup
        (where as jest.Mock).mockReturnValue('where-clause');
        
        // Mock getDocs to return events
        (getDocs as jest.Mock).mockResolvedValue({
          forEach: (callback) => {
            mockEventData.forEach((event, index) => {
              callback({
                id: `event${index + 1}`,
                data: () => ({ ...event, id: undefined }) // Remove id from data as it's added by the function
              });
            });
          }
        });
        
        // Call the function
        const result = await fetchUserIdEvents('user123');
        
        // Verify where and query were called with correct params
        expect(where).toHaveBeenCalledWith('user', '==', 'user123');
        expect(query).toHaveBeenCalledWith('mocked-collection-ref', 'where-clause');
        
        // Verify result
        expect(result).toEqual(mockEventData);
      });
  
      it('should handle errors when fetching user events', async () => {
        // Mock getDocs to throw error
        (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        const result = await fetchUserIdEvents('user123');
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching events: ', 
          expect.any(Error)
        );
        
        // Verify result
        expect(result).toBeNull();
      });
    });
  
    describe('fetchTodaysEvents', () => {
      it('should fetch today\'s events successfully', async () => {
        // Mock event data
        const mockEvents = [
          { id: 'event1', title: 'Morning Event' },
          { id: 'event2', title: 'Afternoon Event' }
        ];
        
        // Mock query setup
        (where as jest.Mock).mockReturnValue('where-clause');
        
        // Mock getDocs to return events
        (getDocs as jest.Mock).mockResolvedValue({
          docs: mockEvents.map(event => ({
            id: event.id,
            data: () => ({ title: event.title })
          }))
        });
        
        // Call the function
        const result = await fetchTodaysEvents();
        
        // Verify Timestamp was used to create range
        expect(Timestamp.fromDate).toHaveBeenCalledTimes(2);
        
        // Verify query was built correctly
        expect(where).toHaveBeenCalledTimes(2);
        expect(where).toHaveBeenNthCalledWith(1, 'start', '>=', expect.anything());
        expect(where).toHaveBeenNthCalledWith(2, 'start', '<=', expect.anything());
        
        // Verify result contains events with IDs
        expect(result).toEqual([
          { id: 'event1', title: 'Morning Event' },
          { id: 'event2', title: 'Afternoon Event' }
        ]);
      });
  
      it('should handle errors when fetching today\'s events', async () => {
        // Mock getDocs to throw error
        (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        const result = await fetchTodaysEvents();
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching today's events:", 
          expect.any(Error)
        );
        
        // Verify result
        expect(result).toBeNull();
      });
    });
  
    describe('uploadProfileImage', () => {
      it('should upload profile image successfully', async () => {
        // Mock file
        const mockFile = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
        const mockResizedImage = new Blob(['resized content']);
        
        // Mock implementations
        (readAndCompressImage as jest.Mock).mockResolvedValue(mockResizedImage);
        (listAll as jest.Mock).mockResolvedValue({
          items: [{ name: 'old-image.jpg' }]
        });
        (deleteObject as jest.Mock).mockResolvedValue(undefined);
        (uploadBytes as jest.Mock).mockResolvedValue({ ref: 'uploaded-image-ref' });
        (getDownloadURL as jest.Mock).mockResolvedValue('https://example.com/profile.jpg');
        
        // Call the function
        const result = await uploadProfileImage('user123', mockFile);
        
        // Verify image was resized
        expect(readAndCompressImage).toHaveBeenCalledWith(mockFile, expect.anything());
        
        // Verify existing images were listed
        expect(ref).toHaveBeenCalledWith(undefined, 'profileImages/user123/');
        expect(listAll).toHaveBeenCalledWith('mocked-storage-ref');
        
        // Verify old images were deleted
        expect(deleteObject).toHaveBeenCalled();
        
        // Verify new image was uploaded
        expect(uploadBytes).toHaveBeenCalledWith(
          'mocked-storage-ref', 
          mockResizedImage
        );
        
        // Verify download URL was fetched
        expect(getDownloadURL).toHaveBeenCalledWith('mocked-storage-ref');
        
        // Verify result
        expect(result).toBe('https://example.com/profile.jpg');
      });
  
      it('should handle errors when uploading profile image', async () => {
        // Mock file
        const mockFile = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
        
        // Mock readAndCompressImage to throw error
        (readAndCompressImage as jest.Mock).mockRejectedValue(new Error('Resize error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        const result = await uploadProfileImage('user123', mockFile);
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error uploading/replacing profile image:', 
          expect.any(Error)
        );
        
        // Verify result
        expect(result).toBeNull();
      });
    });
  
    describe('deleteEvent', () => {
      it('should delete an event successfully', async () => {
        // Mock deleteDoc to resolve
        (deleteDoc as jest.Mock).mockResolvedValue(undefined);
        
        // Call the function
        await deleteEvent('event123');
        
        // Verify doc was called with correct params
        expect(doc).toHaveBeenCalledWith({}, 'events', 'event123');
        
        // Verify deleteDoc was called
        expect(deleteDoc).toHaveBeenCalledWith('mocked-doc-ref');
      });
  
      it('should handle errors when deleting an event', async () => {
        // Mock deleteDoc to throw error
        (deleteDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        await deleteEvent('event123');
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error deleting event: ', 
          expect.any(Error)
        );
      });
    });
  
    describe('updateEvent', () => {
      it('should update an event successfully', async () => {
        // Mock updatedData
        const updatedData = {
          title: 'Updated Event',
          description: 'Updated description'
        };
        
        // Mock updateDoc to resolve
        (updateDoc as jest.Mock).mockResolvedValue(undefined);
        
        // Call the function
        await updateEvent('event123', updatedData);
        
        // Verify doc was called with correct params
        expect(doc).toHaveBeenCalledWith({}, 'events', 'event123');
        
        // Verify updateDoc was called with correct data
        expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', updatedData);
      });
  
      it('should handle errors when updating an event', async () => {
        // Mock updateDoc to throw error
        (updateDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
        
        // Spy on console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call the function
        await updateEvent('event123', { title: 'Updated Event' });
        
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith(
          'Error updating event: ', 
          expect.any(Error)
        );
      });
    });
  });