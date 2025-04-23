import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Box,
    CircularProgress,
    IconButton,
    useTheme,
    useMediaQuery,
    Breadcrumbs,
    Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from '@mui/material/Unstable_Grid2';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: theme.shadows[8],
        "& .MuiCardMedia-root": {
            transform: "scale(1.1)",
        },
    },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    paddingTop: "100%",
    position: "relative",
    transition: "transform 0.3s ease-in-out",
}));

const CarouselContent = styled(Box)(({ theme }) => ({
    position: "relative",
    height: "100px",
    overflow: "hidden",
}));

const CarouselItem = styled(Box)(({ theme, active }) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: active ? 1 : 0,
    transform: active ? "translateX(0)" : "translateX(100%)",
    transition: "all 0.3s ease-in-out",
}));

const CarouselControls = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    zIndex: 1,
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: "1.25rem",
}));

const NewInStock = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndices, setActiveIndices] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        fetch("/data/stockDataS.json")
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
                // Инициализация индексов для карусели
                const initialIndices = {};
                data.forEach((item) => {
                    initialIndices[item.id] = 0;
                });
                setActiveIndices(initialIndices);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке данных:", error);
                setLoading(false);
            });
    }, []);

    const handlePrev = (itemId) => {
        setActiveIndices((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] - 1 + 3) % 3,
        }));
    };

    const handleNext = (itemId) => {
        setActiveIndices((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] + 1) % 3,
        }));
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ mb: 6 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 4 }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </Link>
                    <Typography color="text.primary">New in Stock</Typography>
                </Breadcrumbs>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700, mb: 4 }}
                >
                    New in Stock Collection
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <StyledCard>
                            <StyledCardMedia
                                image={item.images.png}
                                title={item.model}
                                component="a"
                                href="#no-scroll"
                            >
                                <picture>
                                    <source srcSet={item.images.webp} type="image/webp" />
                                    <img
                                        src={item.images.png}
                                        alt={item.model}
                                        style={{ display: "none" }}
                                    />
                                </picture>
                            </StyledCardMedia>
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <CarouselContent>
                                    <CarouselItem active={activeIndices[item.id] === 0}>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {item.model}
                                        </Typography>
                                    </CarouselItem>
                                    <CarouselItem active={activeIndices[item.id] === 1}>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.color}
                                        </Typography>
                                    </CarouselItem>
                                    <CarouselItem active={activeIndices[item.id] === 2}>
                                        <PriceTypography variant="h6">
                                            ${item.price}
                                        </PriceTypography>
                                    </CarouselItem>
                                    <CarouselControls>
                                        <IconButton
                                            onClick={() => handlePrev(item.id)}
                                            sx={{
                                                color: "white",
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                "&:hover": {
                                                    bgcolor: "rgba(0,0,0,0.7)",
                                                },
                                            }}
                                        >
                                            <ChevronLeftIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleNext(item.id)}
                                            sx={{
                                                color: "white",
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                "&:hover": {
                                                    bgcolor: "rgba(0,0,0,0.7)",
                                                },
                                            }}
                                        >
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </CarouselControls>
                                </CarouselContent>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<VisibilityIcon />}
                                    sx={{
                                        borderRadius: "25px",
                                        textTransform: "none",
                                        transition: "all 0.3s ease-in-out",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default NewInStock; 