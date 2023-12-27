import Usenet, { IUsenet } from '../models/usenet.model';  // Achten Sie darauf, dass Sie den korrekten Pfad angeben
import { Request, Response } from 'express'; // Import Response from express

export const getSearchedMovies = async (req: Request, res: Response) => {
    try {
    const searchQuery = req.query.name; // Oder req.params.name, wenn Sie Route-Parameter verwenden möchten

    // Prüfen Sie, ob searchQuery ein String ist, um Typsicherheit zu gewährleisten
    if (typeof searchQuery !== 'string') {
        return res.status(400).json({ message: 'Suchanfrage muss eine Zeichenkette sein' });
    }

    // Verwenden Sie eine regex-basierte Suche, um Übereinstimmungen zu finden.
    // 'i' macht die Suche case-insensitive.
    const results: IUsenet[] = await Usenet.find({
        name: { $regex: new RegExp(searchQuery, 'i') }
    });

    const resultsSort: { name: string, year: number }[] = results.map((result: IUsenet) => ({
        name: result.name,
        year: result.year,
    }));

    res.json(resultsSort);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};